var p = "http://localhost:8899/crawling.html"
var url = require("url")
var res = url.parse(p)
console.log(url)
console.log(res)
x = new url.Url()
x.host = res.host
x.port = res.port
x.protocol = "ws"
x.pathname = "/crawling"
x.search = "username=haha"
console.log(x)
console.log(url.format(x))
