const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const hotLoader = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true'

module.exports = {
	mode: 'development',
	devtool: 'chesource-map',
	entry:{
		lib: ['react', 'react-dom'],
		'comment':[hotLoader,path.join(__dirname,'/static/js/home/index.js')],
		'admin':[hotLoader,path.join(__dirname,'/static/js/admin/index.js')],
		'home':[hotLoader,path.join(__dirname,'/static/js/home/home.js')]
	},
	output:{
		path: path.resolve(__dirname,'dist'),
		filename:'js/[name].js',
		publicPath: '/'
	},
	externals: {
		React: 'react',
		ReactDOM: 'react-dom'
	},
	module:{
		rules:[
			{
				test: /(\.jsx|\.js)$/,
				loader:'babel-loader',
				exclude:/node_modules/,
				query: {
					plugins: [
						['import', [{ libraryName: 'antd', style: 'css' }]],
					]
				},
			},
			{test: /\.(less)$/,
				use: ['css-hot-loader',{
					loader: MiniCssExtractPlugin.loader // creates style nodes from JS strings
				},{
					loader: 'css-loader', // translates CSS into CommonJS
				},{
					loader: 'less-loader', // compiles Less to CSS
				}]
			},
			{
				test: /\.(svg|png|wav|gif|jpg)$/,
				use: { loader: 'file-loader'}
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader',
					fallback: 'style-loader'
				}),
			}
		]

	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].css'
		}),
		new ExtractTextPlugin({ filename: '/css/[name].css', disable: false, allChunks: true}),
		new CopyWebpackPlugin([{
			from: path.join(__dirname, 'static/images'),
			to: path.join(__dirname, '/dist/images'),
		}]),
		new CopyWebpackPlugin([{
			from: path.join(__dirname, 'static/css'),
			to: path.join(__dirname, '/dist/css'),
		}]),
		new CleanWebpackPlugin(
			['./dist/js/*.js', './dist/css/*.css'], {
				root: __dirname,
				verbose: true,
				dry: false
			}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		// new BundleAnalyzerPlugin({ analyzerPort: 8919 })
	]
}