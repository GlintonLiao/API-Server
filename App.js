// 导入 express 模块
const express = require('express')
// 创建 express 实例
const app = express()

// 响应失败结果的中间件，给 res 挂载一个属性
app.use(function(req, res, next) {
  // status = 0 表示成功，1 表示失败，默认为 1
  res.cc = function(err, status=1) {
    res.send({
      // 状态
      status, 
      // 状态描述
      message: err instanceof Error ? err.message : err, 
    })
  }
  next()
})

// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())
// 配置解析表单数据的中间件
app.use(express.urlencoded({extended: false}))

// 导入配置文件
const config = require('./config')
// 配置解析 token 的中间件
const expressJWT = require('express-jwt')
// 指定有哪些接口不需要进行 token 认证
app.use(expressJWT({secret: config.jwtSerectKey}).unless({ path: [/^\/api\//] }))

// 全局错误级别中间件
const joi = require('@hapi/joi')
// 错误中间件
app.use(function(err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
  // 其他错误
  res.cc(err)
})


// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 以 ‘my’ 开头的接口，都是有权限的接口，需要进行 token 验证
app.use('my', userinfoRouter)

// 指定端口号并开启服务器
app.listen(3007, function() {
  console.log('api server running at http://127.0.0.1:3007')
})
