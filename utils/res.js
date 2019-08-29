
var mysql = require('mysql')
var dbConfig = require('../db/DBConfig')
var pool = mysql.createPool( dbConfig.blog )
/* 处理返回数据的工具集合 */

// 使用DBConfig.js的配置信息创建一个MySql链接池
// 封装mysql请求
function query(sqlState) {
  console.log('query')
  return new Promise(function(resolve, reject){        
    pool.getConnection(function (err, connection) {
      connection.query(sqlState, function (err, result) {
        if(result) resolve(result)
        if(err) reject(err)
        })  
        // 释放链接
        connection.release();
    });
  });
}

// 响应一个JSON数据
function responseJSON (res,ret) {
  // 如果没有ret返回数据
  let result ={}
  if (!ret) {
    result.responseCode = '9999'
    result.responseMsg = '系统出错'
  } else {
    // 如果数据查询结果失败
    if (ret.errorMsg) {
      result.responseCode = ret.code || '5000' ,
      result.responseMsg = ret.errorMsg || '操作失败'
    } else {
      result.responseCode = ret.code || '0000' ,
      result.responseMsg = ret.message || '操作成功'
    }
    if (ret.data) result.data = ret.data
  }
  
  res.json(result);
}

module.exports = {
  responseJSON,
  query
}