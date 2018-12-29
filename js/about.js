/**
 * “关于”页面
 * */
var axios = require("axios")
var vue = require("vue/dist/vue.min.js")
axios.get("userlist").then(function (resp) {
    var userList = resp.data
    new vue({
        el: "#main",
        data: {
            users: userList
        }
    })
}).catch((err) => {
    console.log(err)
})