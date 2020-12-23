const state={
	c_component:{
		// k线页面，点击按钮切换模块，需要的数据
		//1.current是当前需要的模块，false不显示任何模块,显示kline组件，
		//2.data为对应模块需要的数据
		// current:false,
		current:'STG_DETAILS',//测试
		datas:{
			name: "",
			type: "专家",
			go_home:true,//是否需要返回首页的标记，如果值是'no',
			             //则不显示内页返回按钮，首页刷新函数不启动，
			page_from:'',//跳转自哪个组件
			
		}
	},
	SecurityID:'--',
	home_height:null,//首页的高度，由于内部组件是绝对定位，造成首页高度塌陷
	location_el:null
};
export default state;
