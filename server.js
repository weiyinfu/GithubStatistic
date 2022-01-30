/*
* 服务端的主程序
* */
var express = require("express")
var webpack = require('webpack')
var process = require("process")
//必须在引入debug模块之前设置好环境变量
process.env.DEBUG = "*"
var log = require("debug")("server")
var ws = require("ws")
var http = require("http")


var webpackConfig = require('./webpack.config')
var httpHandler = require("./core/httpHandler")
var wsHandler = require("./core/wsHandler")
var config = require("./core/config")

//定义好express app
app = express()
//如果是开发模式，那么启用webpack自动更新，否则就当没有webpack
if (webpackConfig.mode == "development") {
    var webpackDevMiddleware = require('webpack-dev-middleware')
    var compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler))
} else {
    //若为生产模式，启用压缩
    app.use(require('compression')())
    //生产环境必须带上头盔
    app.use(require("helmet")())
}

//设置静态资源
app.use(express.static("./dist"))
app.use(express.static("./html"))

httpHandler(app)//注册一系列URL到函数的映射

//定义server
var server = http.createServer(app)
const crawlingWs = new ws.Server({noServer: true})//默认websocket也会创建一个服务器，现在不创建了，只用这个websocket来处理事件


//定义server的事件
crawlingWs.on("connection", wsHandler)
server.on('upgrade', function upgrade(request, socket, head) {
    log(`upgrade ${request.url}`)
    crawlingWs.handleUpgrade(request, socket, head, function done(conn) {
        crawlingWs.emit('connection', conn, request);//可以定义多个wsServer，调用server的emit函数就能够把消息发送过去
    })
})
server.listen(config.port, function () {
    log("http://localhost/search.html")
})