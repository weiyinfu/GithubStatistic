var conf = require("./core/config")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    mode: conf.mode,
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
        rules: [
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            }
        ]
    },
    node: {
        // fs: "empty"
    },
    plugins: [
        new MiniCssExtractPlugin({
            linkType: false,
            filename: x => {
                var targetName = x.chunk.name;
                var name = targetName.slice(0, targetName.lastIndexOf("."))
                return name + ".css"
            }
        }),
    ]
}
