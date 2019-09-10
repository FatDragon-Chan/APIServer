// 引入res工具类
var {responseJSON,query,updateToken} = require('../../utils/res')


module.exports={
  /* 后台-管理员注册 */
  reg:function (req,res,next) {
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
  },

  /* 后台-管理员登录 */
  login:function  (req,res,next) {
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
  },

  /* 后台-获取管理员信息 */
  getInfo :function  (req,res,next) {
    var param = req.body
    var _res = res
    var result = {}
    query(`select a.user_name,a.avatar,b.role_name,b.role_id from user a join role b on a.user_role_id = b.role_id where token = '${param.token}'`).then(res => {
      if (res.length) {
        result.message = '获取用户信息成功'
        result.data = {
          ...res[0]
        }
      }else {
        result.error = '获取用户信息失败'
      }
      responseJSON(_res,result)
    }).catch(err => {
      responseJSON(_res)
    })
  },
  
  /* 后台-登出 */
  logout:function (req,res,next) {
    var param = req.body
    var _res = res
    var result = {}
    query(`UPDATE user SET token = '' WHERE token = '${param.token}'`).then(res => {
      result.message = '退出成功'
      responseJSON(_res,result)
    }).catch(err => {
      responseJSON(_res)
    })
  },

  /* 更改文章状态 */
  changeArticle:function (req,res,next) {
    var param = req.body
    var _res = res
    var result = {}
    query(`UPDATE article SET status = '${param.status===2?1:param.status}'  ${param.status===0?`,update_time = NOW()`:''} WHERE articleId = '${param.articleId}'`).then(res => {
      switch (param.status) {
        case 0:
          result.message='发布成功'
          break;
        case 1:
          result.message='下架成功'
          break;
        case 2:
          result.message='还原成功'
          break;
        case 3:
          result.message='删除成功'
          break;
        default:
          break;
      }
      responseJSON(_res,result)
    }).catch(err => {
      responseJSON(_res)
    })
  },


  /* 新增or编辑文章 */
  addOrUpdateArticle: function (req,res,next) {
    console.log('update',req.body)
    let param = req.body
    let _res =res
    let result = {}
    console.log(param)
    query(`insert into article (articleId,articleTitle,articleMainMap,tagIds,articleDesc,categoryId,article_detail,is_original,createdTime)  values(${param.articleId},${param.articleTitle},${param.articleMainMap},${param.tagIds},${param.articleDesc},${param.categoryId},${param.article_detail},${param.is_original},now()) ) ON DUPLICATE key update articleTitle=${param.articleTitle},articleMainMap=${param.articleMainMap},tagIds=${param.tagIds},articleDesc=${param.articleDesc},categoryId=${param.categoryId},article_detail=${param.article_detail},is_original=${param.is_original},update_time=now()`).then(res => {
      console.log(res)
    }).catch(err => {
      responseJSON(_res)
    })
    // query(`replace into article(articleId,articleTitle,articleMainMap,tagIds,articleDesc,categoryId,article_detail,is_original,createdTime)
    //  values(${param.articleId},${param.articleTitle},${param.articleMainMap},${param.tagIds},${param.articleDesc},${param.categoryId},${param.article_detail},${param.is_original},now()) `)
  },

}