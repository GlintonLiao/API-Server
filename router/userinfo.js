// 导入 express 模块
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入 handler 函数
const userinfo_handler = require('../router_handler/userinfo')
// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)

// 对外暴露路由对象
module.exports = router