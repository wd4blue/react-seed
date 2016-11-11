/*
* @Author: lushijie
* @Date:   2016-02-25 15:33:13
* @Last Modified by:   lushijie
* @Last Modified time: 2016-11-11 17:09:19
*/

var webpack = require('webpack');
var path = require('path');
var moment = require('moment');
var Pconf = require('./webpack.plugin.conf.js');

var isDev = (JSON.parse(JSON.stringify(process.env.NODE_ENV || 'development')) == 'development');

//definePlugin 根据NODE_ENV注入,不过一般情况下直接设置为 production，防止开发环境下看见warning
// var DEFINE_INJECT = {
//     ENV:{
//         'process.env': {NODE_ENV: JSON.stringify('development')}
//     },
//     PUB:{
//         'process.env': {NODE_ENV: JSON.stringify('production')}
//     }
// };
// var definePluginOptions = {
//     DEFINE_INJECT: DEFINE_INJECT[isDev ? 'ENV':'PUB']
// };

var bannerOptions = `This file is modified by lushijie at ${moment().format('YYYY-MM-DD h:mm:ss')}`;

var htmlPluginOptions = {
        filename: 'index.html',// 访问地址 http://127.0.0.1:5050/dist/index.html
        title: 'route',
        hash: true,
        inject: false, //此时不注入相关的js,否则如果之前手动引入了js，可能导致重复引入
        template: path.resolve(__dirname, 'src/index.html'),
        favicon:path.resolve(__dirname, 'src/public/images/favicon.ico'),
        minify:{
            removeComments: false,
            collapseWhitespace: false,
            minifyCSS: false
        },
        //chunks: ['common','home'],
        //excludeChunks: ['','']
};


module.exports = {
    //cheap-module-eval-source-map 编译快，但是不利于查看错误
    devtool: isDev ? 'inline-source-map' : 'cheap-module-source-map',

    context: __dirname,

    entry: {
        index: './src/index.jsx',
    },
    output: {
        publicPath: '/dist/',
        path: 'dist',
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',//当时entry使用对象形式时，[hash]不可以使用，[id]、[chunkhash]与[name]可以使用
    },
    module: {
        preLoaders: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test:/\.css$/,
                loader: "style!css!postcss"
            },
            {
                test:/\.scss$/,
                loader: "style!css!sass"
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=./img/[name].[ext]'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: [
                  path.join(__dirname, 'node_modules'),
                ],
                query: {
                    cacheDirectory: true,
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    },
    plugins: [
        //Pconf.transferWebpackPluginConf(),
        //Pconf.extractTextPluginConf(),
        //Pconf.providePluginConf({$: 'jquery'}),
        //Pconf.cleanPluginConf(['dist']),
        Pconf.bannerPluginConf(bannerOptions),
        //Pconf.definePluginConf(definePluginOptions),
        Pconf.definePluginConf(),
        Pconf.uglifyJsPluginConf(),
        Pconf.commonsChunkPluginConf(),
        Pconf.minChunkSizePluginConf(),
        //Pconf.hotModuleReplacementPluginConf(),
        Pconf.dedupePluginConf(),
        Pconf.htmlWebPackPluginConf(htmlPluginOptions),
        new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: require('./manifest.json'),
        }),
    ],
    resolve:{
        root: [
            path.join(__dirname)
        ],
        extensions: ['', '.js', '.jsx'],
        alias:{
            'constants': path.join(__dirname, 'src/common'),
            'common': path.join(__dirname, 'src/common'),
            'components': path.join(__dirname, 'src/components'),
            'routes': path.join(__dirname, 'src/routes'),
            'images': path.join(__dirname, 'src/public/images'),
            'styles': path.join(__dirname, 'src/public/styles')
        }
    },
    devServer: {
        stats: {
            cached: false,
            colors: true
        },
        contentBase: '.',
        //hot: true,
        //inline: true,
        port: 5050,
        host: '0.0.0.0',
        //historyApiFallback: true //如果是index.html直接这一项就可以了
        historyApiFallback: {
            index: '/dist/index.html', //warning 1.这里不要使用__dirname! 2.使用生成的dist时要/dist，区别于src/app/index.html
            // rewrites: [
            //     { from: /\/soccer/, to: '/soccer.html'}
            // ]
        }
    }
};
