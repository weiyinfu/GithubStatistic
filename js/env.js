const x = location.href
let isQingfuwu = true;
if (x.indexOf("app.cloudendpoint.cn") !== -1) {
    //不是轻服务
    isQingfuwu = true;
}
module.exports = {
    isQingfuwu,
}