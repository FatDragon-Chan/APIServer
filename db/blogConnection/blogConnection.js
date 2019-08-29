// 引入res工具类
var {responseJSON,query} = require('../../utils/res')
// 使用DBConfig.js的配置信息创建一个MySql链接池

module.exports={
  // 分页查询文章数据
  selective : (req,res,next) => {
    // 获取前台页面传过来的参数
    var param = req.body;
    var _res = res;
    var result = {};
    query(`select count(*) from article where isDelete=0  ${param.categoryId?`and  categoryId = ${param.categoryId}`:''} ${param.keyword?`and  articleTitle like '%${param.keyword}%'`:''} ${param.tagId?`and find_in_set(${param.tagId}, tagIds)`:''}`).then(res => {
      if (!res) {
        result = {
          errorMsg : '文章总数查询失败'
        }
      }else {
        result = {
          message:'查询成功',
          data: {
            total: res[0]['count(*)'],
            isLastPage:false
          }
        }
        let total =  result.data.total 
        let totalPage =  total % param.pageSize == 0 ? total / param.pageSize : Math.ceil(total / param.pageSize)
        if (totalPage<1) {
          totalPage = 1
        }
        result.data.lastPage = totalPage
        if (param.page >= totalPage) {
          param.page = totalPage
          result.data.isLastPage = true
        }
        query(`select * from article ${param.categoryId?` where categoryId = ${param.categoryId}`:''} ${param.keyword?`where articleTitle like '%${param.keyword}%'`:''} ${param.tagId?`where find_in_set(${param.tagId}, tagIds)`:''} order by createdTime limit ${param.pageSize} offset ${(param.page-1)*param.pageSize}`).then(subres => {
          if (!subres) {
            result = {
              errorMsg: '分页查询失败'
            };
          }else {
            result.data.list = subres
          }
          return result
        }).then(result => {
          responseJSON(_res,result)
        }).catch( err => {
          responseJSON(_res)
        })
      }
    }).catch (err => {
      responseJSON(_res)
    })
  },

  // 分页查询分类及标签数据
  getAllClassify : (req,res,next) => {
    var param = req.body
    var _res = res
    var result = {
      data:{}
    }
    // 查询分类
    query(`select a.categoryId,a.categoryName,b.counts from category a left join (select categoryId,counts from(select categoryId,count(*) as counts from article group by categoryId)tmp) b on a.categoryId=b.categoryId order by counts DESC`).then(res => {
      if (!res) {
        result.errorMsg = '分类查询失败'
      }else {
        result.data.categoriesList = res
      }
    }).catch(err => {
      responseJSON(_res)
    })
    // 查询标签
    query(`select * from tag`).then(tagres => {
      if (!tagres) {
        result.errorMsg = '标签查询失败'
      }else {
        result.data.tagsList = tagres
      }
      
    }).catch(err => {
      responseJSON(_res)
    })
     // 把返回队列放在最尾
     setTimeout(() => {
      responseJSON(_res,result)
    }, 300);
  }

}