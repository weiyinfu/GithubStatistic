/**
 * github爬虫
 * */

axios = require("axios")
cheerio = require("cheerio")

class GithubCrawler {
  //判断用户是否存在
  static exist(username, callback) {
    axios
      .get(`http://github.com/${username}`)
      .then(resp => callback(true))
      .catch(err => {
        callback(false)
      })
  }

  constructor(username, cout, callback) {
    this.repos = [] //下载到的repo
    this.visited = new Set() //已经访问过的url列表
    this.activeCount = 0 //活跃线程数
    this.username = username.trim()
    this.cout = cout //输出函数
    this.callback = callback //任务完成之后调用的函数
    this.over = false //结束标志
  }

  crawl(url) {
    if (this.visited.has(url)) {
      //已访问过的不必再访问
      return
    }
    this.activeCount++ //活跃线程数加一
    this.cout(`crawling ${url}`)
    this.visited.add(url)
    axios
      .get(url)
      .then(resp => {
        if (resp.status == 200) {
          this.handler(resp.data)
        } else {
          this.cout(resp.status)
          this.cout("请求" + url + "失败")
        }
        this.activeCount--
        this.checkOver() //每次请求完成之后都要检查一次是否完成全部任务
      })
      .catch(err => {
        this.activeCount--
        this.cout("请求失败")
        if (err.response)
          //如果是其它地方的异常，可能没有response对象，防止再出异常
          this.cout("" + err.response.status)
        this.over = true
        this.checkOver()
      })
  }

  handler(page) {
    var $ = cheerio.load(page)
    var next = $(".paginate-container a")
    for (var i = 0; i < next.length; i++) {
      var it = next.eq(i)
      if (it.text().indexOf("Next") != -1) {
        this.crawl(it.attr("href"))
      }
    }
    var lis = $("#user-repositories-list li")
    for (var i = 0; i < lis.length; i++) {
      var li = lis.eq(i)
      var repo = {
        repoName: li
          .find("h3 a")
          .text()
          .trim(),
        repoUrl: li
          .find("h3 a")
          .attr("href")
          .trim(),
        repoDesc: li
          .find("p")
          .text()
          .trim(),
        language: li
          .find("[itemprop=programmingLanguage]")
          .text()
          .trim(),
        star: li
          .find(".Link--muted.mr-3")
          .eq(0)
          .text()
          .trim(),
        fork: li
          .find(".Link--muted.mr-3")
          .eq(1)
          .text()
          .trim(),
        forkedFrom: li
          .find(".f6.text-gray.mb-1 a")
          .text()
          .trim()
      }
      this.cout(repo)
      this.repos.push(repo)
    }
  }

  //简单地规整一下数据
  static formatData(repos) {
    for (var repo of repos) {
      var star = repo.star ? parseInt(repo.star) : 0
      var fork = repo.fork ? parseInt(repo.fork) : 0
      repo.star = star
      repo.fork = fork
      if (!repo.language) {
        repo.language = "txt"
      }
    }
  }

  //根据活跃线程数检查是否下载完毕
  checkOver() {
    if (!this.over && this.activeCount > 0) {
      this.cout("downloading ...")
    } else {
      this.cout("下载完毕")
      GithubCrawler.formatData(this.repos)
      this.callback(this.repos)
    }
  }

  start() {
    this.crawl("https://github.com/" + this.username + "?tab=repositories")
  }
}

module.exports = GithubCrawler
if (require.main == module) {
  fs = require("fs")
  var username = "weiyinfu"
  new GithubCrawler(
    username,
    function(s) {
      console.log(s)
    },
    function(data) {
      //导出爬取到的数据
      console.log("正在保存数据" + data.length)
      fs.writeFileSync(username + ".json", JSON.stringify(data,null,2))
    }
  ).start()
  GithubCrawler.exist("cuiqingcai", flag => {
    console.log(flag)
  })
}
