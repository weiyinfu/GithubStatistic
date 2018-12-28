/**
 * 爬取过程页面
 * 使用websocket向用户展示爬取过程
 * */


var url = require("url")
var querystring = require("querystring")
var $ = require("jquery")

//根据url解析用户名字
function parseUserName() {
    var res = url.parse(location.href)
    if (!res.query) return null
    var query = querystring.parse(res.query)
    if (!query.username) return null
    return query.username
}

var username = parseUserName()
if (!username) {
    location.href = "search.html"
}

var wsServer = 'ws://localhost/crawling/?username=' + username //服务器地址
var websocket = new WebSocket(wsServer) //创建WebSocket对象

function write(message) {
    $("#console").append($(`<p><span class="serverSay">&gt;</span>&nbsp;${message}</p>`))
}

websocket.onopen = function (evt) {
    //建立连接
    write("connection opened")
}
websocket.onclose = function (evt) {
//已经关闭连接
    write("connection close")
}
websocket.onmessage = function (evt) {
//收到服务器消息，使用evt.data提取
    var message = evt.data
    write(message)
    if (message == "nothing") {//爬虫没有在爬取
        location.href = "youHaveNothing.html"
    }
    else if (message == "over") {//已经爬完了，跳到信息页面
        location.href = "statistic.html?username=" + username
    } else if (message == "404") {//没有此用户
        location.href = "youHaveNothing.html"
    } else {
        var ele = document.querySelector("#console")
        ele.scrollTop = ele.scrollHeight
    }
}
websocket.onerror = function (evt) {//产生异常
    console.log(evt)
}