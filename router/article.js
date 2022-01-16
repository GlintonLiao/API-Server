const express = require('express')
const router = express.Router()

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const { add_article_schema } = require('../schema/article')

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({dest: path.join(__dirname, '../uploads')})

// 导入文章处理函数
const article_handler = require('../router_handler/article')

// 先用 multer 解析表单数据
// 再用 expressJoi 对解析的表单数据进行验证
router.post('/add',upload.single('cover_img'),expressJoi(add_article_schema), article_handler.addArticle)

module.exports = router
