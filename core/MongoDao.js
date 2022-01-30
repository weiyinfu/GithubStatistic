/**
 * 使用MongoDb实现数据存储
 * */
var mongo = require("mongodb")
var conf = require("./config")
var pool = require("generic-pool")

class MongoDao {
    constructor() {
        this.connectionPool = pool.createPool({
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

    }

    clearConnections() {
        this.connectionPool.drain().then(() => {
            myPool.clear();
        })
    }

    static basicFind(condition, callback) {
        this.connectionPool.acquire().then(
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

    loadUser(username, callback) {
        this.basicFind({username: username}, data => {
            if (data.length === 0) callback(null)
            else callback(data[0])
        })
    }

    loadUserList(callback) {
        this.basicFind({}, (data) => {
            callback(data.map(x => x.username))
        })
    }

    insertOne(username, repos, callback) {
        this.connectionPool.acquire().then(cli => {
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

    update(username, repos, callback) {
        this.connectionPool.acquire().then(cli => {
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

    putUser(username, repos, callback) {
        this.basicFind({username: username}, user => {
            if (user == null || user.length === 0) {
                MongoDao.insertOne(username, repos, callback)
            } else {
                MongoDao.update(username, repos, callback)
            }
        })
    }
}

module.exports = MongoDao
if (require && require.main === module) {

    MongoDao.loadUser("weiyinfu", (res) => {
        console.log(res)
    })
}

