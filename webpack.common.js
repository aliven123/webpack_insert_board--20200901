// 公共配置
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
	CleanWebpackPlugin
} = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const plugins = [
	new CleanWebpackPlugin({
		cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')]
	}),
	new HtmlWebpackPlugin({
		template: './src/index.html',
		filename: 'index.html',
		chunks: ['index']
	}),
	new VueLoaderPlugin(),
	new webpack.ProvidePlugin({
		// shiming,垫片，使用$的地方，自动引入jquery
		$: 'jquery'
	})
];
const files = fs.readdirSync(path.resolve(__dirname, './dll'));
files.forEach(file => {
	if (/.*\.dll\.js?/.test(file)) {
		plugins.push(new AddAssetHtmlWebpackPlugin({
			filepath: path.resolve(__dirname, './dll', file)
		}))
	};
	if(/.*\.manifest\.json?/.test(file)){
		plugins.push(new webpack.DllReferencePlugin({
			manifest: path.resolve(__dirname, './dll', file)
		}))
	}
});
module.exports = {
	entry: {
		index: './src/pages/index.js'
	},
	resolve: { //设置别名
		alias: {
			assets: path.resolve(__dirname, 'src/assets/'),
			components: path.resolve(__dirname, 'src/components/'),
			store: path.resolve(__dirname, 'src/store/')
		}
	},
	externals: {
		Vue: 'vue'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			options: {
				presets: [
					[
						'@babel/preset-env', {
							useBuiltIns: 'usage',
							corejs: 2
						}
					]
				]
			}
		}, {
			test: /\.(eot|ttf|svg|woff)$/,
			use: {
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'images/'
				}
			}
		}, {
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}, {
			test: /\.less$/,
			use: [{
				loader: 'style-loader'
			}, {
				loader: 'css-loader'
			}, {
				loader: 'less-loader'
			}]
		}, {
			test: /\.vue$/,
			use: 'vue-loader'
		}]
	},
	plugins,
	optimization: {
		//代码分割
		splitChunks: {
			chunks: 'all',
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '-',
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10,
					reuseExistingChunk: true,
					// filename: 'vendors.js',
				},
				default: {
					priority: -20,
					reuseExistingChunk: true,
					filename: 'js/common.js'
				}
			}
		}
	},
	output: {
		filename: 'js/[name]-[hash].js', //这里指定js打包后的文件夹/文件名
		path: path.resolve(__dirname, './dist'),
		chunkFilename: 'js/[name].js' //间接引用的js,存放的位置和名称
	}
}
