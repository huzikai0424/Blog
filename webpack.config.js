const path = require('path');
module.exports={
    devtool: 'eval-source-map',
    entry:{
        "comment":[path.join(__dirname,"/static/js/index.js")],
        "admin":[path.join(__dirname,"/static/js/admin/index.js")]
    },
    output:{
        path: path.resolve(__dirname,'static'),
        filename:'dist/[name].js',
        publicPath: '/'
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
            },
            {
                test: /\.(svg|png|wav|gif|jpg)$/,
                use: { loader: 'file-loader'}
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader"
                    }
                ]
            }
        ]
        
    }
}