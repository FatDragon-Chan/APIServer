// 引入res工具类
var {responseJSON,query,updateToken} = require('../../utils/res')

/* 后台-管理员注册 */
function reg (req,res,next) {
  // 获取前台页面传过来的参数
  var param = req.body
  var _res = res
  var result = {}
  query(`INSERT user (user_name,user_password,create_time)  VALUES ('${param.username}','${param.password}',NOW())`).then(res => {
    return updateToken(res.insertId)
  }).then(res => {
    result.message = '注册成功'
    responseJSON(_res,result)
  }).catch(err => {
    result.error = err.errorMsg || '注册失败'
    responseJSON(_res,result)
  })
}

/* 后台-管理员登录 */
function login (req,res,next) {
  var param = req.body
  var _res = res
  var result = {}
  query(`select * from user where user_name = '${param.username}' and user_password = '${param.password}'`).then(res => {
    if (res.length > 0) {
      let token =  updateToken(res[0].user_id)
      result.message = '登陆成功'
      result.data = {
        token
      }
    }else {
      result.error = '用户名或密码错误,请检查后重试'
    }
    responseJSON(_res,result)
  }).catch(err => {
    responseJSON(_res)
  })
}

/* 后台-获取管理员信息 */
function getInfo (req,res,next) {
  var param = req.body
  var _res = res
  var result = {}
  console.log(param)
  query(`select a.user_name, b.role_name,b.role_id from user a join role b on a.user_role_id = b.role_id where token = '${param.token}'`).then(res => {
    console.log(res)
  })
}
module.exports={
  reg,
  login,
  getInfo

}