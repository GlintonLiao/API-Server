// 导入数据库操作模块
const db = require('../db/index')

exports.getArticleCates = (req, res) => {
  // 根据分类的状态，获取所有未被删除的分类列表数据
  // is_delete 为 0 表示没有被标记为删除的数据
  const sql = 'SELECT * FROM ev_article_cate WHERE is_delete=0'
  db.query(sql, (err, results) => {
    if (err) return res.cc(err)
    res.send({
      status: 0, 
      message: '获取文章分类列表成功', 
      data: results,
    })
  })
}
