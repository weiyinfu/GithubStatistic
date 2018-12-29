const ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
    // mode: "production",
    mode: "development",
    entry: {
        "show.js": "./js/show.js",
        "crawling.js": "./js/crawling.js",
        "about.js": "./js/about.js",
        "search.js": "./js/search.js",
    },
    output: {
        filename: "[name]"
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({use: ['css-loader', 'less-loader']})
        }]
    },
    node: {
        fs: "empty"
    },
    plugins: [new ExtractTextPlugin({
        filename: getPath => {
            var targetName = getPath("[name]")
            var name = targetName.slice(0, targetName.lastIndexOf("."))
            return name + ".css"
        }
    })],
}
