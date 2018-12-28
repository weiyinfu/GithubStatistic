基于Node的github信息查看工具

# 功能
通过爬虫爬取某个用户github repo信息，统计他的语言分布、获取的star数、fork数、最好的repo等信息。

# 技术栈
* express：后端
* cheerio+axios：爬虫
* ws：websocket展示爬取过程
* webpack：打包工具
* echarts：图表展示
* vue：模板渲染
* mongodb：存储数据

# TODO
* show界面加载太丑陋
* crawling界面加一个ajax请求，如果存在，直接显示show即可，不必显示你没有
* 不要一个劲的跳转
* 显示完之后返回主界面
* 手机端
* 添加安全过滤器，过滤掉不合法的请求
