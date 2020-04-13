const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const path = require('path');

module.exports = {
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(png|mp3|wav)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.(scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: 'file-loader?name=./res/fonts/[name].[ext]'
                }
            },
            {
                test: /\.(frag|vert)$/,
                use: {
                    loader: 'raw-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new ExtractTextPlugin(
            {
                filename: 'style.css',
                allChunks: true
            }
        ),
        new JavaScriptObfuscator({
            compact: true,
            debugProtection: false,
            debugProtectionInterval: false,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'mangled',
            renameGlobals: true,
            rotateStringArray: true,
            selfDefending: true,
            shuffleStringArray: true,
            sourceMap: false,
            target: 'browser',
            transformObjectKeys: true,
            unicodeEscapeSequence: true
        }),
    ],
    resolve: {
        extensions: [
            ".js",
            ".ts"
        ]
    },
    entry: [
        "./src/index.ts"
    ]
};
