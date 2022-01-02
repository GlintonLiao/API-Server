const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入路由处理函数
const userHandler = require('../router_handler/user')

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要验证的对象
const { reg_login_schema } = require('../schema/user')

// 注册新用户
// 在注册新用户的路由中声明局部中间件
// 数据验证通过后，才会转交给路由处理函数
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

// 将路由对象暴露出去
module.exports = router
