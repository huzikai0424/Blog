module.exports={
    devtool: 'eval-source-map',
    entry:__dirname+"/static/js/index.js",
    output:{
        path:__dirname+'/static',
        filename:'index.js'
    },
    module:{
        rules:[
            {
                test: /(\.jsx|\.js)$/,
                use:{loader:"babel-loader"},
                exclude:/node_modules/
            },
            {
                test: /\.less$/,
                use:[
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'less-loader'
                ]
            }
        ]
        
    }
}