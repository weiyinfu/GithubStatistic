/**
 * 使用文件实现
 * */

const fs = require("fs")
const conf = require("./config")
const path = require("path")

class GithubFileDao {
    constructor() {
        this.folder = conf.targetDir;
    }

    loadUser(username, callback) {
        const filename = path.join(this.folder, username + ".json")
        const exist = fs.existsSync(filename)
        if (!exist) {
            callback(null)
            return
        }
        //每三天更新一次
        const res = fs.readFileSync(filename).toString("utf8")
        try {
            JSON.parse(res);
        } catch (e) {
            return
        }
        callback({
            repos: JSON.parse(res),
            username: username,
            lastUpdateTime: fs.statSync(filename).mtimeMs
        })
    }

    loadUserList(callback) {
        let files = fs.readdirSync(this.folder)
        files = files.filter(x => x.endsWith('.json')).map(x => x.slice(0, x.length - ".json".length))
        callback(files)
    }

    putUser(username, repoList, callback) {
        const filename = path.join(this.folder, username + ".json")
        fs.writeFileSync(filename, JSON.stringify(repoList))
        callback()
    }
}

module.exports = GithubFileDao