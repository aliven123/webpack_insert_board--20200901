import $ from 'jquery';
import Vue from 'vue'
import Kline from './kline/index.vue'
import basefn from '../assets/common.js';
import store from '../store/index.js';
import ElementUI from 'element-ui';

Vue.use(ElementUI);
Vue.prototype.basefn=basefn;

// 动态配置接口地址
const env=process.env.NODE_ENV

if(env=='development'){
	Vue.prototype.url_obj={
		/* lai_url:'http://10.88.71.83:8006',
		bin_url:'http://10.88.71.83:23333',
		shuo_url:'http://10.88.71.83:8008', */
		
		lai_url:'http://10.88.71.83:8006',
		bin_url:'http://10.88.71.83:23333',
		shuo_url:'http://10.88.71.83:8008'
	};
}else if(env=='production'){
	Vue.prototype.url_obj={
		lai_url:'https://data.nujin.com',
		bin_url:'https://data.nujin.com',
		shuo_url:'https://data.nujin.com'
	};
};

new Vue({
  el: '#aupool_single_page_ctn',
  store,
  render:(createElement)=>createElement(Kline)
})