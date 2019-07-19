var express = require('express');
var router = express.Router();
var userHttp = require('../db/userConnection')

// 后台-管理员注册
router.post('/reg',function(req,res,next){
  userHttp.reg(req,res,next)
});

// 后台-管理员登陆
router.post('/login',function(req,res,next){
  userHttp.login(req,res,next)
})

module.exports = router;