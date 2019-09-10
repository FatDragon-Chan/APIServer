var express = require('express');
var router = express.Router();
const qiniu = require('qiniu')
const formidable = require('formidable')
var {responseJSON,query,updateToken,checkTokenTime} = require('../utils/res')
var qiniuConfig = require( "../qiniu");

/* 需要token校验 */
router.use(function (req, response, next) {
  let token = req.body.token
  if (!token) {
    response.status(200).json({
      responseCode:'1006',
      responseMsg:'登陆过期,请重新登录'
    });
    return false
  }else {
    checkTokenTime(token).then(res => {
      if (!res.affectedRows) {
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

// 七牛云获取上传token
router.post('/getUploadToken',function(req,res,next){
  let _res =res
  let result = {}
  try{
    let accessKey = qiniuConfig.accessKey  // 源码删除:七牛云获取 ak,必须配置
    let secretKey = qiniuConfig.secretKey  // 源码删除:七牛云获取 sk, 必须配置
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let options = {
      scope: qiniuConfig.scope,  // 对应七牛云存储空间名称
      expires: 7200 //token过期时间
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    result.message='获取上传token成功'
    result.data = {
      uploadToken
    }
    console.log(result)
    responseJSON(_res,result)
  }catch(error) {
    responseJSON(_res)
  }
});



// 七牛云上传
router.post('/uploadImg',function(req,res,next){
  let _res =res
  try{
    let accessKey = qiniuConfig.accessKey  // 源码删除:七牛云获取 ak,必须配置
    let secretKey = qiniuConfig.secretKey  // 源码删除:七牛云获取 sk, 必须配置
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let options = {
      scope: qiniuConfig.scope,  // 对应七牛云存储空间名称
      expires: 7200 //token过期时间
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    let form = formidable.IncomingForm();
    form.parse(req, function(err,fields,file){
      if(file) {
        let localFile = file.file.path
        let config = new qiniu.conf.Config();
        let formUploader = new qiniu.form_up.FormUploader(config);
        let putExtra = new qiniu.form_up.PutExtra();
        let key= `${Date.now()}`+file.file.name;
        formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr, respBody, respInfo) {
          let result = {
            data:{
              respErr,
              imgUrl: `${qiniuConfig.origin}${respBody.key}`,//在七牛云上配置域名
              hash: respBody.hash,
              status: respInfo.statusCode,
              filename: respBody.key
            }
          }
          responseJSON(_res,result)
        })
      }
    })
  }catch(error) {
    responseJSON(_res)
  }
});





module.exports = router;