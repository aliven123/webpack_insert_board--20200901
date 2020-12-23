import * as Types from './types.js';
const mutations={
	// 切换显示组件函数
	setDatas(state,obj){
		// 更新state中的数据
		const {key,val}=obj;
		state[key]=val;
	},
	[Types.toggleComponent](state,cpt){
		const c_component=JSON.parse(JSON.stringify(state.c_component))
		c_component.current=cpt.current;
		console.log(cpt.datas);
		for(const key of Object.keys(cpt.datas)){
			if(cpt.datas[key]){
				Object.assign(c_component.datas,{
					[key]:cpt.datas[key]
				})
			}
		};
		this.commit('setDatas',{
			key:'c_component',
			val:c_component
		});
		console.log(c_component);
		console.log(state.c_component);
	},
	[Types.setLocationEl](state,datas){
		// 弹窗定位相对的元素节点信息
		console.log(datas);
		if(datas.element){
			state.location_el=datas;
		}else{
			state.location_el=null;
		}
	},
	[Types.setHomeHeight](state,datas){
		console.log(datas);
		state.home_height=datas.home_height;
	}
};
export default mutations;