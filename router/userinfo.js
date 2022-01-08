// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要进行验证的对象
const { update_userInfo_schema } = require('../schema/user')

// 导入 handler 函数
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户的基本信息
router.post('/userinfo',expressJoi(update_userInfo_schema) ,userinfo_handler.updateUserInfo)

// 对外暴露路由对象
module.exports = router
