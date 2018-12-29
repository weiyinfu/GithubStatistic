/**
 * 对应static.html
 * 针对下载的数据进行信息展示
 * */
require("../css/statistic.less")
//默认直接引入全部echarts比较大，需要弄得小一些，提高加载速度
// var echarts = require("echarts")
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/pie');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/visualMap');
var axios = require("axios")
var vue = require("vue/dist/vue.js")//此处应该注意，不能直接饮用vue，而应该饮用dist中的vue
var url = require("url")
var querystring = require("querystring")


var statistic = require("./statistic")

//根据url解析用户名字
function parseUserName() {
    var res = url.parse(location.href)
    if (!res.query) return null
    var query = querystring.parse(res.query)
    if (!query.username) return null
    return query.username
}

//主要的渲染函数
function render(repos) {
    var languageDic = statistic.languageUse(repos)
    var languageNameValueList = []
    for (var i in languageDic) {
        languageNameValueList.push({name: i, value: languageDic[i]})
    }
    languageNameValueList.sort(function (one, two) {
        return two.value - one.value
    })
    echarts.init(document.querySelector("#languageUse")).setOption({
        backgroundColor: '#2c343c',

        title: {
            text: '语言使用分布',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: languageNameValueList[languageNameValueList.length - 1].value,
            max: languageNameValueList[0].value,
            inRange: {colorLightness: [0.2, 0.7]}
        },
        series: [
            {
                name: 'repo个数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: languageNameValueList,
                roseType: 'radius',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.5)'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 10,
                        length2: 20
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c23531',
                        shadowBlur: 200,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },

                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    })
    echarts.init(document.querySelector("#languageUseBar")).setOption({
        title: {
            text: '语言使用情况'
        },
        tooltip: {},
        legend: {
            data: ['repo个数']
        },
        xAxis: {
            data: languageNameValueList.map(x => x.name)
        },
        yAxis: {},
        series: [{
            name: 'repo个数',
            type: 'bar',
            data: languageNameValueList.map(x => x.value)
        }]
    })
    //使用vue渲染
    var starAndFork = statistic.starAndFork(repos)
    new vue({
        el: "#starAndFork",
        data: {
            starNumber: starAndFork.star,
            forkNumber: starAndFork.fork,
            originalNumber: starAndFork.self,
            forkOthersNumber: starAndFork.forkOther,
            username: username,
            loading: false
        }
    })

    //repo排名
    var repoRank = statistic.repoRank(repos)
    if (repoRank.length == 0) {
        document.querySelector("#repoRank").innerHTML = "<span>You have no good repos</span>"
    } else {
        var repoNameValues = []
        for (var repo of repoRank) {
            repoNameValues.push({name: `${repo.name} star:${repo.star} fork:${repo.fork}`, value: repo.score})
        }
        echarts.init(document.querySelector("#repoRank")).setOption({
                backgroundColor: '#2c343c',

                title: {
                    text: '好的repo[前7名]',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#eee'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} "
                },

                visualMap: {
                    show: false,
                    min: repoNameValues[0].value,
                    max: repoNameValues[repoNameValues.length - 1].value,
                    inRange: {
                        colorLightness: [0.2, 0.9]
                    }
                },
                series: [
                    {
                        name: "",
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: repoNameValues.sort(function (a, b) {
                            return b.value - a.value;
                        }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.5)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                // color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },

                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            }
        )
    }
}


var username = parseUserName()
if (!username) {
    location.href = "search.html"
} else {
    axios.get("githubinfo/" + username).then(function (resp) {

        if (resp.data == "updating") {
            location.href = "crawling.html?username=" + username
            return
        }
        var repos = resp.data
        if (repos.length == 0) {
            location.href = "youHaveNothing.html"
        } else {
            render(resp.data)
        }
    })
}
