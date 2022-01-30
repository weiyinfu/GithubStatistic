/**
 * 配置信息
 * config中不能引用其余包，保证config出于依赖最底层，防止出现依赖回路
 * */
const os = require("os")
const path = require("path")
const fs = require("fs")

//如果使用FileDao，需要指明存放目标文件的路径
var targetDir = path.join(os.homedir(), 'github-statistic')
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
}
//如果使用MongoDao，需要指明URL
var mongoUrl = "mongodb://github:good@localhost:27017/githubstatistic"

module.exports = {
    // mode: "development",
    mode: "production",
    //http服务的端口号
    port: 80,
    targetDir: targetDir,
    mongoUrl: mongoUrl,
    // dao: "MongoDao",
    dao: "InspireDao",
    // dao: "FileDao",
    updateInterval: 1000 * 3 * 24 * 60 * 60,//更新频率，默认为1000毫秒*3天*24小时*60分钟*60秒
}
