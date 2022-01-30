var githubCrawler = require("./GithubCrawler")
var common = require("./common")
var conf = require("./config")
var FileDao = require("./FileDao")
const MongoDao = require("./MongoDao")
const InspireDao = require("./InspireDao")
const inspirecloud = require('@byteinspire/api');
let dao = null
if (conf.dao === "FileDao") {
    dao = new FileDao()
} else if (conf.dao === "MongoDao") {
    dao = new MongoDao()
} else if (conf.dao === "InspireDao") {
    dao = new InspireDao();
} else {
    throw new Error("unknown dao type " + conf.dao)
}

//更新用户
function update(username) {
    var crawler = new githubCrawler(username, function (message) {
        if (conf.dao === "InspireDao") {
            //如果使用Inspiredao，则应该把数据追加到inspiredao中
            if (typeof message !== "string") {
                message = JSON.stringify(message, null, 2)
            }
            inspirecloud.redis.rpush(username, message).then(msg => {
                console.log(`submitting crawling message ${message}`)
            })
        }
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
    app.get("/queryCrawling", function (req, resp) {
        const username = req.query.username.trim();
        inspirecloud.redis.lrange(username, 0, -1).then(user => {
            if (user === null) {
                return "nothing";
            }
            resp.json(user);
        }).catch(e => {
            console.error("queryCrawling error")
            console.error(e)
        })
    })
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
                console.log("load user has nothing")
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
        const username = req.params.username
        console.log(`=====start scrawl username=${username}`)
        //清空crawling数据库
        if (conf.dao === "InspireDao") {
            inspirecloud.redis.del(username).then(() => {
                console.log(`deleted crawling info ${username}`)
            }).catch(e => {
                console.error(`delete key error ${e}`)
            })
        }
        githubCrawler.exist(username, flag => {
            console.log(`github exists ${username} flag=${flag}`)
            if (flag) {
                update(username)
                resp.end("ok")
            } else {
                resp.end("no this user")
            }
        })
    })
    app.get("/crawling")
    app.get("/exist", (req, resp) => {
        const username = req.params.username
        githubCrawler.exist(username, flag => {
            resp.json(flag)
        })
    })
}

