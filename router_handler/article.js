// 发布新文章的路由处理函数
exports.addArticle = (req, res) => {
  console.log(req.body); // 文本类型的数据
  console.log('-------- 分割线 --------');
  console.log(req.file); // 文件类型的数据

  if (!req.file || req.file.fieldname != 'cover_img') return res.cc('文章封面是必选参数')

  // 导入处理文件路径的模块
  const path = require('path')

  const articleInfo = {
    // 标题、内容、状态、所属的分类 Id
    ...req.body, 
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.filename), 
    // 文章发布时间
    pub_date: new Date(), 
    // 文章作者 Id
    author_id: req.user.id, 
  }

  const db = require('../db/index')
  const sql = `INSERT INTO ev_articles SET ?`
  db.query(sql, articleInfo, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('发布文章失败')
    res.cc('发布文章成功', 0)
  })
}