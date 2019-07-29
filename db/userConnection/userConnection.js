var mysql = require('mysql');
var dbConfig = require('../DBConfig');
var userSQL = require('./userSql');

// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool( dbConfig.mysql );

// 响应一个JSON数据
var responseJSON = function (res, ret) {
  console.log('响应JSON数据')
  if (typeof ret === 'undefined') {
    res.json({
        code: '5000',
        msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

// 后台-管理员注册
function reg (req,res,next){
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.body;
    var _res = res;
    var data = {};
    connection.query(userSQL.insert, [param.user_name,param.user_password], function (err, result) {
      console.log(result,err)
      if(result) {
          data.result = {
            code: '0000',
            msg: '注册成功'
          };
        } else {
          data.result = {
            code: '5000',
            msg: '注册失败'
          };
        }
      })  
      if(err) data.err = err;
      // 以json形式，把操作结果返回给前台页面
      setTimeout(function () {
        responseJSON(_res, data)
      },300);
      // 释放链接
      connection.release();
  });
}
// 后台-管理员登陆
function login (req,res,next) {
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.body;
    var _res = res;
    var data = {};
    connection.query(userSQL.insert, [param.user_name,param.user_password], function (err, result) {
      console.log(result,err)
      if(result) {
          data.result = {
            code: '0000',
            msg: '登录成功'
          };
        } else {
          data.result = {
            code: '5000',
            msg: '登录失败'
          };
        }
      })  
      if(err) data.err = err;
      // 以json形式，把操作结果返回给前台页面
      setTimeout(function () {
        responseJSON(_res, data)
      },300);
      // 释放链接
      connection.release();
  }) 
}

module.exports={
  reg,
  login
}