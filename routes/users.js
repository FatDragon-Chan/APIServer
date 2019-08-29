var express = require('express');
var router = express.Router();
var userHttp = require('../db/userConnection/userConnection')
var {checkTokenTime} = require('../utils/res')

// md5验证 sign
// router.use(function (req, response, next) {
//   // 如果签名获取不对,返回签名状态异常
//   if (!req.body.sign || !checkSign(req.body)) {
//     response.status(200).json({
//       result:{
//         responseCode:'5000',
//         responseMsg:'签名错误'
//       }
//     });
//     return false;
//   }
//   next()
// })

/* 需要验证token */

router.use(function (req, response, next) {
  if (!req.body.token) {
    response.status(200).json({
      responseCode:'1006',
      responseMsg:'登陆过期,请重新登录'
    });
    return false
  }else {
    checkTokenTime('e8563859406016963356c1088dfeb0e0').then(res => {
      if (!res) {
        response.status(200).json({
          responseCode:'1006',
          responseMsg:'登陆过期,请重新登录'
        });
        return
      }
      next()
    })
  }
})

/* 不需要验证token */

// 后台-管理员注册
router.post('/reg',function(req,res,next){
  userHttp.reg(req,res,next)
});

// 后台-管理员登陆
router.post('/login',function(req,res,next){
  userHttp.login(req,res,next)
})







module.exports = router;