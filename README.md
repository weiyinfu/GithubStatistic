基于Node的github信息查看工具

# 功能
通过爬虫爬取某个用户github全部repo信息，统计他的语言分布、获取的star数、fork数、最好的repo等信息。

# 运行
## 开发环境
修改config.js的mode="development"，在项目根目录下运行node server.js即可。
## 生产环境
修改config.js的mode="production"，在项目根目录下运行webpack,node server.js两个命令。

# 技术栈
* express：后端框架
* cheerio+axios：爬虫
* ws：websocket展示爬取过程
* webpack：打包工具
* less：样式语言
* echarts：图表展示
* vue：模板渲染
* jquery：DOM操作
* mongodb：存储数据
* generic-pool：数据库连接池

# 文件说明
* html+js+css：存放前端内容
* server.js：程序入口，运行此程序启动服务，websocket和http共用同一端口
* core/httpHandler：处理http请求
* core/wsHandler：处理websocket请求
* core下数据库相关GithubDao.js、MongoDao.js、FileDao.js，使用MongoDb还是使用文件作为存储时可配置的，二者遵循同样的接口（即GithubDao）
* core/GithubCrawler：github爬虫
* core/config.js：项目配置
* core/common.js：全局变量，例如存储正在运行的爬虫
* src+index.js：轻服务封装

# 前端页面
* 搜索页：首页，用于搜索用户信息
* 详情页：展示统计信息
* 过程页：展示爬虫爬取过程
* 关于页：查看网站相关信息
* 空白页：什么也没有

当搜索时，如果用户不存在，跳到空白页；如果用户信息存在，跳到详情页；如果用户信息已过时，后台自动更新用户数据（启动爬虫），前端跳到过程页。  
当直接访问详情页时，如果不存在用户信息，直接跳到空白页；如果用户信息已过时，跳到过程页。  
当在过程页时，爬取完毕去往详情页，爬取失败去往空白页。

# 轻服务
https://qingfuwu.cn/

轻服务不支持websocket，因此运行时会出错。

# 后记
相似网站[githuber.cn](https://githuber.cn/people/16095925)
查看最近活跃的repo：[gitmemory](https://www.gitmemory.com/weiyinfu)
