var mysql = require('mysql');
var dbConfig = require('../DBConfig');
var blogSql = require('./blogSql');

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

// 博客-分页查询
function selective (req,res,next){
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.body;
    var _res = res;
    var data = {};
    connection.query(`select * from article ${param.categoryId?`where categoryId = ${param.categoryId}`:''} ${param.keyword?`where articleTitle like '%${param.keyword}%'`:''}  order by createdTime limit ${param.pageSize} offset ${(param.page-1)*param.pageSize} `, function (err, result) {
      console.log(result,err)
      if(result) {
          data.result = {
            code: '0000',
            msg: '查询成功',
            data: {
              list:result
            }
          };
        } else {
          data.result = {
            code: '5000',
            msg: '查询失败'
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

module.exports={
  selective
}