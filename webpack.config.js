const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
module.exports = {
	devtool: 'none',
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
	entry:{
		lib: ['react', 'react-dom'],
		'comment':[path.join(__dirname,'/static/js/home/index.js')],
		'admin':[path.join(__dirname,'/static/js/admin/index.js')],
		'home':[path.join(__dirname,'/static/js/home/home.js')]
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
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({

					use: 'css-loader!less-loader',
					fallback: 'style-loader'
				}),
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

		// new BundleAnalyzerPlugin({ analyzerPort: 8919 })
	]
}