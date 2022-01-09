// 导入数据库操作模块
const db = require('../db/index')
// 导入加密模块
const bcrypt = require('bcryptjs')

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
}

// 导出更新用户信息的处理函数
exports.updateUserInfo = (req, res) => {
  const sql = `UPDATE ev_users SET ? WHERE id=?`
  db.query(sql, [req.body, req.body.id], (err, results) => {
    // 执行 sql 语句失败
    if (err) return res.cc(err)
    // 执行 sql 语句成功，但影响行数不为 1
    if (results.affectedRows !== 1) return res.cc('修改用户信息失败')
    // 修改用户信息成功
    return res.cc('修改用户信息成功', 0)
  })
}

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
  const sql = `SELECT * FROM ev_users WHERE id=?`
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err)
    // 检查指定的 id 的用户是否存在
    if (results.length !== 1) return res.cc('用户不存在')
  })

  // 判断提交的旧密码是否正确
  const compareResult = bcrypt.compare(req.body.oldPwd, results[0].password)
  if (!compareResult) return res.cc('原密码错误')

  const sql = `UPDATE ev_users SET password=? WHERE id=?`
  // 对新密码进行加密处理
  const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
  // 更新用户密码
  db.query(sql, [newPwd, req.user.id], (err ,results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('更新密码失败')
    res.cc('更新密码成功', 0)
  })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  const sql = `UPDATE ev_users SET user_pic=? WHERE id=?`
  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return rec.cc('更新头像失败')
    return res.cc('更新头像成功')
  })
}
