import Vue from 'vue';
import Vuex from 'vuex';
import state from './state.js';
import mutations from './mutations.js';
Vue.use(Vuex);
Vue.filter('RMB',function(value){
	if(!value){return '-'}
	return `￥${value}`
})
const store=new Vuex.Store({
	state,
	mutations
});
export default store;
