const path = require('path')
const uglify = require('uglifyjs-webpack-plugin')
const htmlPlugin= require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const glob = require('glob')
const PurifyCSSPlugin = require("purifycss-webpack")
const webpack = require('webpack')
const copyWebpackPlugin= require("copy-webpack-plugin")

module.exports={
    //入口文件的配置项,可以是单一入口，也可以是多入口。
    entry:{
        entry:'./src/entry.js',
        // entry2:'./src/entry2.js'
    },
    //出口文件的配置项,支持多出口配置
    output:{
        //打包的路径位置
        // path.resolve将相对路径转为绝对路径。下面的：./dist
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
        //打包的文件名称
        // [name]的意思是根据入口文件的名称，打包成相同的名称，有几个入口文件，就可以打包出几个文件。
        // filename:'[name].js'

    },
    //模块：配置模块，主要是解析CSS和图片转换压缩等功能。
    module:{
        // test：用于匹配处理文件的扩展名的表达式，这个选项是必须进行配置的；
        // use：loader名称，就是你要使用模块的名称，这个选项也必须进行配置，否则报错；
        // include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
        // query：为loaders提供额外的设置选项（可选）
        rules:[
            {
                test:/\.(css|less)$/,
                // style-loader: 它是用来处理css文件中的url()等
                // css-loader：它是用来将css插入到页面的style标签
                // less-loader编译less为css
                // scss-loader编译scss为css
                use: [ 'style-loader', 'css-loader',"less-loader",'postcss-loader']
            },{
                test:/\.scss$/,
                // 把SASS文件分离到style.css中
                use:ExtractTextPlugin.extract({
                    use:[ "css-loader","sass-loader"],
                    fallback: "style-loader"
                })
            },{
                test:/\.(png|jpg|gif)/,
                use:[{
                    loader:'url-loader',
                    options:{
                        // 是把小于500000B的文件打成Base64的格式，写入JS。
                        limit:5000,
                        // 把图片放到指定的文件夹下
                        outputPath:'images/',
                    }
                }]
            },{
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                loader:"babel-loader",
                options:{
                    presets:[
                        "env","react"
                    ]
                }
            },{
                test: /\.(htm|html)$/i,
                // 解决在hmtl文件中引入<img>标签的问题
                use:[ 'html-withimg-loader'] 
            }
        ]
    },
    //插件，用于生产模版和各项功能
    plugins:[
        new uglify(),
        new htmlPlugin({
            minify:{
                // minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号
                removeAttributeQuotes:true
            },
            // hash：为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            hash:true,
            // template：是要打包的html模版路径和文件名称
            template:'./src/index.html'
        }),
        new ExtractTextPlugin({
            filename: 'css/index.css'
        }),
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.BannerPlugin('dcbryant版权所有'),
        new copyWebpackPlugin([{
            // from:要打包的静态资源目录地址，这里的__dirname是指项目目录下，是node的一种语法，可以直接定位到本机的项目目录中。
            // to:要打包到的文件夹路径，跟随output配置中的目录。所以不需要再自己加__dirname
            from:__dirname+'/src',
            to:'./public'
        }])
    ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构:配置服务器基本运行路径，用于找到程序打包地址
        contentBase:path.resolve(__dirname,'dist'),
        // 服务运行地址，建议使用本机IP，这里为了讲解方便，所以用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:4001
    },
    devtool: 'eval-source-map',
    // watch 配置
    watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregeateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/, 
    }
}

