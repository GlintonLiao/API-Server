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

exports.addArticleCates = (req, res) => {
  const sql = `SELECT * FROM ev_article_cate WHERE name=? OR alias=?`
  db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    if (err) return res.cc(err)

    // 分类名称和分类别名都被占用
    if (results.length === 2) return res.cc('分类名称和别名都被占用')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('文章分类和别名都被占用')

    // 分类名称或分类别名被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('文章分类被占用')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('文章别名被占用')

    const sql = `INSERT INTO ev_article_cate SET ?`
    db.query(sql, req.body, (err, reuslts) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('新增文章失败')
      rex.cc('新增文章分类成功', 0)
    })
  })
}
