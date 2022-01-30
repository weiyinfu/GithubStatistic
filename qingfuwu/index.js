const app = require('./src/app');

// 导出 HTTP handler 供云工程调用，express 对象支持直接作为 HTTP handler
module.exports = app;
