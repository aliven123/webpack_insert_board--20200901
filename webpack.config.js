// 开发环境配置
const {merge}=require('webpack-merge');
const common_config=require('./webpack.common.js');
const path=require('path');
const dev_config={
	mode:'development',
	devtool:'cheap-module-eval-source-map',
	devServer:{
		contentBase:path.resolve(__dirname,'./dist'),
		port:666
	},
	output:{
		filename:'js/[name]-[hash].js',//这里指定js打包后的文件夹
		path:path.resolve(__dirname,'./dist'),
		chunkFilename:'js/[name].js'
	}
};
module.exports=merge(common_config,dev_config);