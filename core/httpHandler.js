var githubCrawler = require("./GithubCrawler")
var common = require("./common")
var conf = require("./config")
var fileDao = require("./FileDao")
var mongoDao = require("./MongoDao")
var dao = null
if (conf.dao === "FileDao") {
    dao = fileDao
} else if (conf.dao === "MongoDao") {
    dao = mongoDao
} else {
    throw new Error("unkown dao type " + conf.dao)
}

//更新用户
function update(username) {
    var crawler = new githubCrawler(username, function (message) {
        console.log(message)
    }, function (repos) {
        if (repos.length) {
            dao.putUser(username, repos, function () {
                console.log(`save user ${username} over`)
            })
        }
        common.crawling[username] = null//下载完成之后需要删掉
        crawler.cout("over")//告知输出器全部结束
    })
    common.crawling[username] = crawler
    crawler.start()
}

module.exports = function (app) {
    //定义url映射
    //获取用户repo
    app.get("/githubinfo/:username", function (req, resp) {
        var username = req.params.username.trim()
        dao.loadUser(username, function (result) {
            if (result) {
                var currentTime = new Date().getTime()
                var valid = Math.abs(currentTime - result.lastUpdateTime) < conf.updateInterval
                if (!valid) {
                    update(username)
                    resp.end("updating")
                }
                resp.json(result.repos)
            } else {
                resp.json([])
            }
        })
    })
    //获取已经用过该功能的用户
    app.get("/userlist", function (req, resp) {
        dao.loadUserList(function (userList) {
            return resp.json(userList)
        })
    })
    app.get("/startcrawl/:username", function (req, resp) {
        //不存在用户信息，开始爬取
        var username = req.params.username
        githubCrawler.exist(username, flag => {
            if (flag) {
                update(username)
                resp.end("ok")
            } else {
                resp.end("no this user")
            }
        })
    })
    app.get("/exist", (req, resp) => {
        var username = req.params.username
        githubCrawler.exist(username, flag => {
            resp.json(flag)
        })
    })
}

