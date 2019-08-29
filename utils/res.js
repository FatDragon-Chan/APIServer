
var mysql = require('mysql')
var dbConfig = require('../db/DBConfig')
var pool = mysql.createPool( dbConfig.blog )
var Md5  =  require('js-md5')
/* 处理返回数据的工具集合 */

// 使用DBConfig.js的配置信息创建一个MySql链接池
// 封装mysql请求
function query(sqlState,errorMsg) {
  
  return new Promise(function(resolve, reject){        
    pool.getConnection(function (err, connection) {
      connection.query(sqlState, function (err, result) {
        if(result) resolve(result)
        if(err) reject({err,errorMsg})
      })  
      // 释放链接
      connection.release();
    });
  });
}

// 更新token
function updateToken(uid) {
  let timestamp=new Date().getTime()
  let token = Md5(`${uid}chenzian${timestamp}`)
  return query(`UPDATE user set token='${token}' , update_time=current_timestamp where user_id = '${uid}'`,'更新token失败')
}

// 延长token有效期
function checkTokenTime(token) {
  console.log('token',token)
  return query(`select a.user_id,token,update_time,NOW() AS search_time from user a where token='${token}' and TIMESTAMPDIFF(HOUR, update_time, NOW()) < 1`).then(res => {
    console.log('res',res)
    if (!res.length) {
      return false
    } else {
      query(`UPDATE user set update_time=CURRENT_TIMESTAMP  where user_id = '${res[0].user_id}'`)
      return true
    }
  })
}


// 响应一个JSON数据
function responseJSON (res,ret) {
  // 如果没有ret返回数据
  let result ={}
  if (ret.error) {
    result.responseCode = '5000'
    result.responseMsg = ret.error || '操作失败'
  } else {
    // 如果数据查询结果失败
    result.responseCode = ret.code || '0000' ,
    result.responseMsg = ret.message || '操作成功'
    if (ret.data) result.data = ret.data
  }
  res.json(result);
}

module.exports = {
  responseJSON,
  query,
  updateToken,
  checkTokenTime
}