// 导入数据库操作模块
const { result } = require('@hapi/joi/lib/base')
const db = require('../db/index')

// 导出用户信息处理的函数
exports.getUserInfo = (req, res) => {
  
  // 根据用户 id 查询用户信息
  // 为了防止密码泄漏，需要排除 password 字段
  const sql = `SELECT id, username, nickname, email, user_pic FROM ev_users WHERE id=?`

  // req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sql, req.user.id, (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err)
    // 执行 sql 语句成功，但查询到的条目不为 1
    if (results.length !== 1) return res.cc('获取用户信息失败')
    // 将用户信息响应给客户端
    res.send({
      status: 0, 
      message: '获取用户基本信息成功', 
      data: results[0], 
    })

  })
  res.send('OK')
}