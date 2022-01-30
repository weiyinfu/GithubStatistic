/**
 * 使用文件实现
 * */

const fs = require("fs")
const conf = require("./config")
const path = require("path")

class GithubFileDao {
    static loadUser(username, callback) {
        var filename = path.join(conf.targetDir, username + ".json")
        var exist = fs.existsSync(filename)
        if (!exist) {
            callback(null)
            return
        }
        //每三天更新一次
        var res = fs.readFileSync(filename).toString("utf8")
        callback({
            repos: JSON.parse(res),
            username: username,
            lastUpdateTime: fs.statSync(filename).mtimeMs
        })
    }

    static loadUserList(callback) {
        var files = fs.readdirSync(conf.targetDir)
        files = files.filter(x => x.endsWith('.json')).map(x => x.slice(0, x.length - ".json".length))
        callback(files)
    }

    static putUser(username, repoList, callback) {
        var filename = path.join(conf.targetDir, username + ".json")
        fs.writeFileSync(filename, JSON.stringify(repoList))
        callback()
    }

}

module.exports = GithubFileDao