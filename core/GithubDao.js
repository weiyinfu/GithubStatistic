/**
 * Dao接口，目前实现FileDao和MongoDao
 * */

class GithubDao {
    putUser(username, repos, callback) {
    }

    loadUser(username, callback) {
    }

    loadUserList() {
    }
}

if (require.main == module) {
    //验证fileDao和mongoDao定义是否完善
    var fileDao = require("./FileDao")
    var mongoDao = require("./MongoDao")
}