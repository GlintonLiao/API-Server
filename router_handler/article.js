// 发布新文章的路由处理函数
exports.addArticle = (req, res) => {
  console.log(req.body); // 文本类型的数据
  console.log('-------- 分割线 --------');
  console.log(req.file); // 文件类型的数据

  res.send('OK')
}