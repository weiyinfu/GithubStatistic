url = require("url")
location = {}
location.href = "https://weiyinfu.cn/githubstatistic/crawling.html?username=Dirge"

function getWsUrl(username) {
    var res = url.parse(location.href)
    x = new url.Url()
    console.log(res.protocol)
    x.protocol = res.protocol == "https:" ? "wss:" : "ws:"
    x.host = res.host
    x.port = res.port
    x.pathname = res.pathname + "/../wss/crawling"//使用相对路径
    x.search = "username=" + username
    return url.format(x)
}

console.log(getWsUrl("Dirge"))
