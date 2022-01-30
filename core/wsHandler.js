/**
 * websocket服务端处理逻辑
 * */
//打印爬虫控制台
var url = require("url")
var querystring = require("querystring")
var common = require("./common")
module.exports = function (conn, request) {
    var query = url.parse(request.url)
    var params = querystring.parse(query.query)
    var userid = params.username
    var crawling = common.crawling
    if (!crawling[userid]) {//如果没有正在爬取，那么用户就不该来这个页面
        conn.send("nothing")
    } else {
        //crawling是用户ID到输出信息的映射
        crawling[userid].cout = function (message) {
            if (typeof message != "string") {
                message = JSON.stringify(message)
            }
            conn.send(message)
        }
    }
    conn.send("connection has been established")
    conn.on('message', function incoming(message) {
        console.log('received: %s', message);
    })
}



