/**
 * Dao接口，目前实现FileDao和MongoDao
 * */
/*
user结构体
username string 用户姓名
repos string 仓库列表
lastUpdateTime 毫秒数值

 */
class GithubDao {
    putUser(username, repos, callback) {
    }

    loadUser(username, callback) {
    }

    loadUserList(callback) {
    }
}

if (require.main == module) {
    //验证fileDao和mongoDao定义是否完善
    var fileDao = require("./FileDao")
    var mongoDao = require("./MongoDao")
}