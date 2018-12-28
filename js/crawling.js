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

function getWsUrl(username) {
    var res = url.parse(location.href)
    x = new url.Url()
    x.protocol = "ws"
    x.host = res.host
    x.port = res.port
    x.pathname = "/crawling"
    x.search = "username=" + username
    return url.format(x)
}

var username = parseUserName()
if (!username) {
    location.href = "search.html"
}

var websocket = new WebSocket(getWsUrl(username)) //创建WebSocket对象

function write(message) {
    $("#console").append($(`<p><span class="serverSay">&gt;</span>&nbsp;${message}</p>`))
}

//建立连接
websocket.onopen = evt => {
    write("connection opened")
}
websocket.onclose = evt => {
//已经关闭连接
    write("connection close")
}
websocket.onmessage = evt => {
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
websocket.onerror = evt => {//产生异常
    console.log(evt)
}
