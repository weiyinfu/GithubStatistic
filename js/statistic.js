/**
 * 统计repos
 * */
//统计各种语言的使用情况
function languageUse(repos) {
    var languageMap = {}
    for (var repo of repos) {
        var lang = repo['language']
        if (!lang) continue
        if (!languageMap[lang]) {
            languageMap[lang] = 1
        } else {
            languageMap[lang]++
        }
    }
    return languageMap
}

//统计star数、fork数、原创数、fork别人数
function starAndFork(repos) {
    var starCount = 0, forkCount = 0
    var forkOther = 0, self = 0
    for (var repo of repos) {
        if (repo.forkedFrom) {
            forkOther++
            continue
        }
        self++
        starCount += repo.star
        forkCount += repo.fork
    }
    return {star: starCount, fork: forkCount, forkOther: forkOther, self: self}
}

//对repo进行打分排序，找到比较好的几个repo
function repoRank(repos) {
    for (let repo of repos) {
        const self = repo.forkedFrom ? -1 : 1
        repo.score = (repo.star + repo.fork * 1.5) * self
    }
    var a = []
    for (let i of repos) a.push(i)
    a.sort((x, y) => y.score - x.score)
    const goodRepos = []
    for (let i = 0; i < a.length; i++) {
        const it = a[i]
        if (it.star || it.fork) {
            goodRepos.push({
                star: it.star, fork: it.fork, name: it.repoName, desc: it.repoDesc, score: it.score
            })
            if (goodRepos.length > 7) break
        } else {
            break
        }
    }
    return goodRepos
}

module.exports = {languageUse: languageUse, starAndFork: starAndFork, repoRank: repoRank}
