const path = require('path');
const express = require('express');
const httpHandler = require("../core/httpHandler");
const wsHandler = require("../core/wsHandler");

const app = express();

// 为应用使用中间件
// 静态文件中间件
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '../html')));
// 请求体 parse 中间件，用于 parse json 格式请求体
app.use(express.json());

//设置静态资源
httpHandler(app)//注册一系列URL到函数的映射

// 若无匹配业务路由，则匹配 404 路由，代表访问路径不存在
app.use(notFound);
/** 若前面的路由抛错，则封装为错误响应返回
 * 错误响应格式为
 * {
 *   error: message
 * }
 */
app.use(errorHandler);

function notFound(req, res) {
    res.status(404);
    res.send({
        error: 'not found'
    });
}

function errorHandler(err, req, res, next) {
    // 抛出的错误可以附带 status 字段，代表 http 状态码
    // 若没有提供，则默认状态码为 500，代表服务器内部错误
    console.error(err)
    res.status(err.status || 500);
    res.send({error: err.message});
}

// 导出 Express 对象
module.exports = app;
