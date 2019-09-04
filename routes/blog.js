var express = require('express');
var router = express.Router();
var blogHttp = require('../db/blogConnection/blogConnection')

var checkSign = require('../utils/sign');

// md5验证 sign
router.use(function (req, response, next) {
  var param = req.body
  // 如果签名获取不对,返回签名状态异常
  if (!param.sign || !checkSign(param)) {
    response.status(200).json({
      result:{
        responseCode:'5000',
        responseMsg:'签名错误'
      }
    });
    return;
  }
  next()
})

// 博客-分页查询文章表格
router.post('/selective',function(req,res,next){
  blogHttp.selective(req,res,next)
});

// 博客-分页查询分类及标签
router.post('/getAllClassify',function(req,res,next){
  blogHttp.getAllClassify(req,res,next)
});


// 后台-管理员登陆
// router.post('/login',function(req,res,next){
//   blogHttp.login(req,res,next)
// })

module.exports = router;