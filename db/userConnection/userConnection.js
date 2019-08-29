// 引入res工具类
var {responseJSON,query,updateToken} = require('../../utils/res')



/* 模块功能逻辑实现 */
module.exports={
// 后台-管理员注册
reg: (req,res,next) => {
  // 获取前台页面传过来的参数
  var param = req.body
  var _res = res
  var result = {}
  query(`INSERT user (user_name,user_password)  VALUES ('${param.username}','${param.password}')`).then(res => {
    return updateToken(res.insertId)
  }).then(res => {
    result.message = '注册成功'
    responseJSON(_res,result)
  }).catch(err => {
    console.log(err.err)
    result.error = err.errorMsg || '注册失败'
    responseJSON(_res,result)
  })
},

// 后台-管理员登录
login: (req,res,next) => {
  var param = req.body
  var _res = res
  let result = {}
  query(`select * from user where user_name = '${param.username}' and user_password = '${param.password}'`).then(res => {
    if (res.length > 0) {
      return updateToken(res[0].user_id)
    }else {
      result.errorMsg = '用户名或密码错误,请检查后重试'
      return result
    }
  }).then(res => {
    console.log('token',res)
    result = {
      message:'登陆成功',
      data:{
        token
      }
    }
    responseJSON(_res,result)
  }).catch(err => {
    responseJSON(_res)
  })
}


}