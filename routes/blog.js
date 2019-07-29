var express = require('express');
var router = express.Router();
var blogHttp = require('../db/blogConnection/blogConnection')

// 博客-分页查询文章表格
router.post('/selective',function(req,res,next){
  blogHttp.selective(req,res,next)
});

// 后台-管理员登陆
router.post('/login',function(req,res,next){
  blogHttp.login(req,res,next)
})

module.exports = router;