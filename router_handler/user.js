/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

/**
 * 注册用户
 * 1. 检测表单是否合法
 * 2. 检测用户名是否被占用
 * 3. 对密码进行加密处理
 * 4. 插入新用户
 */
exports.regUser = (req, res) => {
  
  // 接收表单数据
  const userInfo = req.body
  // 检测数据是否合法
  if(!userInfo.username || !userInfo.password) {
    return res.cc('用户名或密码不能为空')
  }

  // 定义 SQL 语句
  const sql = `SELECT * FROM ev_users WHERE username=?`
  // 执行 SQL 语句判断用户名是否被占用
  db.query(sql, [userInfo.username], function(err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 用户名被占用
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名')
    }
  })

  // 对密码进行加密处理，返回值是加密后的密码字符串
  userInfo.password = bcrypt.hashSync(userInfo.password, 10)

  // 插入新用户
  const sql = 'INSERT INTO ev_users SET ?'
  db.query(sql, {username: userInfo.username, password: userInfo.password}, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // SQL 语句执行成功，但影响行数不为 1
    if (results.affectedRows != 1) {
      return res.cc('注册用户失败')
    }
    // 注册成功
    res.send({status: 0, message: '注册成功'})
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  const userInfo = req.body

  const sql = `SELECT * FROM ev_users WHERE username=?`
  db.query(sql, userInfo.username, function(err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但数据条数不为 1
    if (results.length !== 1) return res.cc('登录失败')

    // 判断用户输入密码是否正确
    const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
    // 结果为 false 就是失败
    if (!compareResult) {
      return res.cc('登录失败')
    }

    // 登录成功，生成 JWT 的 Token 字符串
    // 剔除密码和头像
    const user = {...results[0], password: '', user_pic: ''}
    // 生成 token 字符串
    const tokenStr = jwt.sign(user, config.jwtSerectKey, {
      expiresIn: '10h'  // token 有效期是 10 小时
    })
    // 将生成的 token 响应给客户端
    res.send({
      status: 0, 
      message: '登录成功',
      // 为了方便使用 token，在服务器上直接拼上 Bearer 前缀
      token: 'Bearer ' + tokenStr,
    })
  })
}
