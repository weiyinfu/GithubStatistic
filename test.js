var mongo = require("mongodb")
mongo.connect("mongodb://weiyinfu.cn:27017", {}, (err, cli) => {
    console.log(err)
    console.log(cli)
})