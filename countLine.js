//统计一下代码行数
var fs = require("fs")
var files = fs.readdirSync(".")
var path = require("path")
var s = 0
for (var i of files) {
    var filename = path.join('.', i)
    if (filename.endsWith(".js")) {
        var content = fs.readFileSync(filename).toString("utf8")
        var lines = content.split("\n")
        s += lines.length
    }
}
console.log("total lines")
console.log(s)