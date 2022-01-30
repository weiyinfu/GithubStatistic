/**
 * 使用MongoDb实现数据存储
 * */
var mongo = require("mongodb")
var conf = require("./config")
var pool = require("generic-pool")

var connectionPool = pool.createPool({
    create: function () {
        return new Promise((resolve, reject) => {
            mongo.connect(conf.mongoUrl, {useNewUrlParser: true}, (err, cli) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(cli)
                    }
                }
            )
        })
    }, destroy: cli => {
        cli.close()
    }
}, {
    max: 10,
    min: 3
})

class MongoDao {
    static clearConnections() {
        myPool.drain().then(() => {
            myPool.clear();
        })
    }

    static basicFind(condition, callback) {
        connectionPool.acquire().then(
            cli => {
                cli.db("githubstatistic").collection("users").find(condition).toArray().then(
                    (data) => {
                        callback(data)
                        connectionPool.release(cli)
                    })
            }
        ).catch(err => {
            console.log(err)
        })
    }


    static loadUser(username, callback) {
        MongoDao.basicFind({username: username}, data => {
            if (data.length == 0) callback(null)
            else callback(data[0])
        })
    }

    static loadUserList(callback) {
        MongoDao.basicFind({}, (data) => {
            callback(data.map(x => x.username))
        })
    }

    static insertOne(username, repos, callback) {
        connectionPool.acquire().then(cli => {
            cli.db("githubstatistic").collection("users").insertOne({
                repos: repos,
                username: username,
                lastUpdateTime: new Date().getTime()
            }, (err, res) => {
                if (err) console.log(err)
                else {
                    callback(err, res)
                }
                connectionPool.release(cli)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    static update(username, repos, callback) {
        connectionPool.acquire().then(cli => {
            cli.db("githubstatistic").collection("users").updateOne({username: username}, {
                $set: {
                    repos: repos,
                    lastUpdateTime: new Date().getTime(),
                },
            }, (err, resp) => {
                if (err) console.log(err)
                else if (callback)
                    callback(err, resp)
            })
        })
    }

    static putUser(username, repos, callback) {
        MongoDao.basicFind({username: username}, user => {
            if (user == null || user.length == 0) {
                MongoDao.insertOne(username, repos, callback)
            } else {
                MongoDao.update(username, repos, callback)
            }
        })
    }
}

module.exports = MongoDao
if (require && require.main == module) {

    MongoDao.loadUser("weiyinfu", (res) => {
        console.log(res)
    })
}

