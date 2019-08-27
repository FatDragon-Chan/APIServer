var mysql = require('mysql');
var dbConfig = require('../DBConfig');
var blogSql = require('./blogSql');

// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool( dbConfig.blog );

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

module.exports={
  // 分页查询文章数据
  selective : (req,res,next) => {
    pool.getConnection(function (err, connection) {
      // 获取前台页面传过来的参数
      var param = req.body;
      var _res = res;
      var data = {};
      connection.query(`select count(*) from article where isDelete=0  ${param.categoryId?`and  categoryId = ${param.categoryId}`:''} ${param.keyword?`and  articleTitle like '%${param.keyword}%'`:''} ${param.tagId?`and find_in_set(${param.tagId}, tagIds)`:''}` , (err, result)=> {
        if (!result) {
          data.result = {
            responseCode: '5000',
            responseMsg: '总数查询失败'
          };
        }else {
          data.result = {
            responseCode : '0000',
            responseMsg:'查询成功',
            data: {
              total: result[0]['count(*)'],
              isLastPage:false
            }
          }
          let total =  data.result.data.total 
          let totalPage =  total % param.pageSize == 0 ? total / param.pageSize : Math.ceil(total / param.pageSize)
          if (totalPage<1) {
            totalPage = 1
          }
          data.result.data.lastPage = totalPage
          if (param.page >= totalPage) {
            param.page = totalPage
            data.result.data.isLastPage = true
          }
          console.log(param,totalPage)
          connection.query(`select * from article ${param.categoryId?`where categoryId = ${param.categoryId}`:''} ${param.keyword?`where articleTitle like '%${param.keyword}%'`:''} ${param.tagId?`where find_in_set(${param.tagId}, tagIds)`:''} order by createdTime limit ${param.pageSize} offset ${(param.page-1)*param.pageSize}`,(err,result) => {
            if(!result) {
              data.result = {
                responseCode: '5000',
                responseMsg: '分页查询失败'
              };
            }else {
              data.result.data.list = result
            };
          })
        };
      })
      if (err) data.err = err;
      // 以json形式，把操作结果返回给前台页面
      setTimeout(function () {
        responseJSON(_res, data)
      },300);
      // 释放链接
      connection.release();
    }
  )},

  // 分页查询分类及标签数据
  getAllClassify : (req,res,next) => {
    pool.getConnection( (err,connection) => {
      var param = req.body
      var _res = res
      var data = {
        result:{
          responseCode: '0000',
          responseMsg: '查询成功',
          data:{}
        }
      }
      connection.query(`select * from category`,(err,result)=> {
        if (!result) {
          data.result = {
            responseCode: '5000',
            responseMsg: '分类查询失败'
          }
        }else {
          result.forEach(el => {
            connection.query(`select count(*) from article where categoryId = ${el.categoryId}`,(err,subresult) => {
              el.articleNum = subresult[0]['count(*)']
            })
          })
          data.result.data.categoriesList = result
        }
      })
      connection.query(`select * from tag`,(err,result) => {
        if (!result) {
          data.result = {
            responseCode: '5000',
            responseMsg: '标签查询失败'
          }
        }else {
          data.result.data.tagsList = result
        }
      })
      
      if (err) data.err = err;
      // 以json形式，把操作结果返回给前台页面
      setTimeout(function () {
        responseJSON(_res, data)
      },300);
      // 释放链接
      connection.release();
    })
  }

}