// 生产环境配置
const path=require('path');
const {merge}=require('webpack-merge');
const common_config=require('./webpack.common.js');
const product_config={
	mode:'production',
	// devtool:'cheap-module-eval-source-map',
	devtool:'cheap-module-source-map',
	output:{
		publicPath:'https://aupool.cn/code/',//生产环境的文件根路径
		filename:'js/[name].js',//这里指定js打包后的文件夹
		path:path.resolve(__dirname,'./dist'),
		chunkFilename:'js/[name].js'
	}
};
module.exports=merge(common_config,product_config);