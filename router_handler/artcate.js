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
    db.query(sql, req.body, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('新增文章失败')
      rex.cc('新增文章分类成功', 0)
    })
  })

  // 删除文章分类的路由处理函数
  exports.deleteCateById = (req, res) => {
    const sql = `UPDATE ev_article_cate SET is_deleted=1 WHERE id=?`
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('删除文章分类失败')
      res.cc('删除文章分类成功')
    })
  }

  // 根据 id 获取文章分类的处理函数
  exports.getArtCateById = (req, res) => {
    const sql = `SELECT * FROM ev_article_cate WHERE id=?`
    db.query(sql, req.params.id, (err, results) => {
      if (err) return res.cc(err)
      if (results.length !== 1) return rex.cc('获取文章分类失败')
      res.send({
        status: 0, 
        message: '获取文章分类数据成功', 
        data: results[0], 
      })
    })
  }

  exports.updateCateById = (req, res) => {
    const sql = `SELECT * FROM ev_article_cate WHERE Id<>? AND (name=? OR alias=?)`
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
      if (err) return res.cc(err)

      // 分类名称 和 分类别名 都被占用
      if (results.length === 2) return res.cc('分类名称和别名都被占用')
      if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称和别名都被占用')

      // 分类名称 或者 分类别名 被占用
      if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用')
      if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用')

      const sql = `UPDATE ev_article_cate SET ? WHERE Id=?`
      db.query(sql, [req.body, req.body.Id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新文章分类失败')
        res.cc('更新文章分类成功', 0)
      })
    })
  }
}
