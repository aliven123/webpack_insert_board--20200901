/* 
当我们一个项目引入了多个较大的包以后，这些包本身并不会运行，
我们也不会修改这些包的代码，但是每当我们修改了业务代码之后，
这些包也会被重新打包。极大的浪费了时间，
这时我们就需要使用这个工具预先把静态资源提前打包，
以后修改源文件再打包时就不会打包这些静态资源文件了。
 */


//目标1.是第三方模块只打包一次,
//2.我们引入这些模块的时候，不去module中查找，直接找第一次打包好的静态文件，

//1.npm install add-asset-html-webpack-plugin
//2.AddAssetHtmlWebpackPlugin
// 入口是vendors,所以打包后的文件名占位符name是vendors;
// npm install add-asset-html-webpack-plugin --save 往html上增加一些静态资源
const path=require('path');
const webpack=require('webpack');

module.exports={
	mode:"production",
	entry:{
		// vendors:['echarts','jquery']
		vue:['vue'],
		echarts:['echarts'],
		jquery:['jquery']
	},
	output:{
		filename:'[name].dll.js',
		path:path.resolve(__dirname,'./dll'),
		library:'[name]'//以全局变量的形式暴露出去，供分析
	},
	plugins:[
		new webpack.DllPlugin({
			// 对library对应的库进行分析,分析的结果放在path路径下
			name:'[name]',
			path:path.resolve(__dirname,'./dll/[name].manifest.json')
		})
	]
}