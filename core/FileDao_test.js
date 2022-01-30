//测试FileDao
const GithubFileDao=require("./FileDao")
GithubFileDao.loadUser("weiyinfu", (repos) => {
    console.log(repos)
})