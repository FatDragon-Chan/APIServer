
/* 处理返回数据的工具集 */
var mysql = require('mysql')
var dbConfig = require('../db/DBConfig')
var pool = mysql.createPool( dbConfig.blog )
var Md5  =  require('js-md5')

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
  query(`UPDATE user set token='${token}' , update_time=current_timestamp where user_id = '${uid}'`,'更新token失败')
  return token
}

// 校验token并更新
function checkTokenTime(token) {
  return query(`UPDATE user AS A INNER JOIN (select a.user_id,token,update_time from user a where token='${token}' and TIMESTAMPDIFF(HOUR, update_time, NOW()) < 1) AS B ON A.user_id=B.user_id SET A.update_time=CURRENT_TIMESTAMP`)
}

// 响应一个JSON数据
function responseJSON (res,ret) {
  let result ={}
  if (ret) {
    result.responseCode = ret.error?'5000':(ret.code || '0000')
    result.responseMsg = ret.error ? ret.error : (ret.message || '操作成功')
    if (ret.data) result.data = ret.data
  } else {
    result.responseCode = '5000'
    result.responseMsg = '操作失败'
  }
  res.json(result);
}

module.exports = {
  responseJSON,
  query,
  updateToken,
  checkTokenTime
}