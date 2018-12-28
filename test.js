var app = require("express")()
var bodyParser = require("body-parser")
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.get("/", (req, resp) => {
    return resp.json(req.query)
})
app.listen(8899)