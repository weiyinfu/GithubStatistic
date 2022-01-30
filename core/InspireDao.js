/**
 * 给轻服务实现的dao
 * */
const inspirecloud = require('@byteinspire/api');

async function putUser(username, repos) {
    const repo = inspirecloud.db.table("repo")
    let user = await repo.where({username}).findOne();
    if (user == null) {
        user = {username}
    }
    user.repos = JSON.stringify(repos);
    user.lastUpdateTime = new Date().getTime();
    return await repo.save(user);
}

async function loadUser(username) {
    const repo = inspirecloud.db.table("repo");
    const user = await repo.where({username}).findOne();
    if (user === null) {
        return null;
    }
    try {
        user.repos = JSON.parse(user.repos);
    } catch (e) {
        console.error("load user error")
        console.error(e)
        return null;
    }
    return user;
}

async function loadUserList() {
    const repo = inspirecloud.db.table('repo');
    const users = await repo.where({}).find();
    return users.map(x => x.username);
}

class InspireDao {
    constructor() {
    }

    putUser(username, repos, callback) {
        putUser(username, repos).then(callback).catch(e => {
            console.error("putUser error:" + username)
            console.error(e)
        })
    }

    loadUser(username, callback) {
        loadUser(username).then(callback).catch(e => {
            console.error(`loadUser error ${username}`)
            console.error(e)
        })
    }

    loadUserList(callback) {
        loadUserList().then(callback).catch(e => {
            console.error(`loadUserList error`)
            console.error(e)
        })
    }
}

module.exports = InspireDao
