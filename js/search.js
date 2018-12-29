/**
 * 搜索页面的js
 * */
require("../css/search.less")
var axios = require("axios")
$ = require("jquery")
document.querySelector("#searchBox").focus()

function info(s) {
    document.querySelector("#remind").innerText = s
}


/*
 *
 * 控件震动动画
 * obj控件
 * time震动时间长——短循环长度
 * wh震动幅度px
 * fx动画速度s
 */
function flash(obj, time, wh, fx) {
    $(function () {
        var $panel = $(obj);
        var offset = $panel.offset() - $panel.width();
        var x = offset.left;
        var y = offset.top;
        for (var i = 1; i <= time; i++) {
            if (i % 2 == 0) {
                $panel.animate({left: '+' + wh + 'px'}, fx);
            } else {
                $panel.animate({left: '-' + wh + 'px'}, fx);
            }

        }
        $panel.animate({left: 0}, fx);
        $panel.offset({top: y, left: x});

    })
}

function doSubmit() {
    var username = document.querySelector("#searchBox").value.trim()
    if (!username) {
        flash(document.querySelector("#searchBox"), 8, 10, 100)
        return false
    }
    $("#cover").css("display", "block")
    axios.get("githubinfo/" + username).then(resp => {
        resp = resp.data
        if (resp == "updating") {//太久了正在更新
            location.href = "crawling.html?username=" + username
            return false
        }
        if (resp == null || resp.length == 0) {//没有现成的数据，开始爬取
            axios.get("startcrawl/" + username).then(resp => {
                if (resp.data == "no this user") {//如果没有此用户
                    $("#cover").css("display", "none")
                    flash(document.querySelector("#searchBox"), 8, 10, 100)
                    info("没有此用户")
                    $("#searchBox").val("")
                } else {//跳转正在搜索页面
                    location.href = "crawling.html?username=" + username
                }
            })
        } else {//有现成的数据，跳转数据展示页面
            location.href = "statistic.html?username=" + username
        }
    }).catch(err => {
        console.log(err)
    })
    return false
}

document.querySelector("#searchBox").onkeydown = function () {
    info("")
}
window.doSubmit = doSubmit