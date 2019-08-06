const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'development',

    /*
     *  examples 下面建多个子目录
     *  demo 放置在不同的目录中
     *  每一个子目录会创建一个 app.ts, 作为webpack的入口文件
     *  entries 是多目录的入口文件，为每个入口引入用于热更新的文件  
    */
    entry: fs.readFileSync(__dirname).reduce((entries, dir) => {
        const fullDir = path.join(__dirname, dir)
        const entry = path.join(fullDir, 'app.ts')
        if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
            entries[dir] = ['webpack-hot-middleware/client'. entry]
        }

        return entries
    }),

    /* 
    *  依据不同目录名，打包生成不同的js, 名称和目录一致 
    */
    output: {
        path: path.join(__dirname, '__build__'),
        filename: '[name].js',
        publicPath: '/__build__/'
    },

    module: {
        rules:[
            {
                test: /\.ts$/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader'
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        extension: ['.ts', '.tsx', '.js']
    },

    plugins: [
        new webpack.HotModuleRepalementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}