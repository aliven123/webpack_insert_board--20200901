import * as Types from 'store/types';
// import {kinds} from '../../pages/kline/kline_options.js';
import {
	mapState
} from 'vuex';
const SecurityID = '000001.SZ';
const toggle_value = '策略详情';
// 搜索引擎拼接查询字符串,使用的键
const s_indicname='s_indicname',s_indic_type='s_indic_type',s_SecurityID='s_SecurityID',s_code='s_code';
let sort_id = undefined;
export default {
	name: 'stg_details',
	/* 策略商城明细 */
	data: function() {
		return {
			profit_picture: null,
			SecurityID,
			vip_level:false,
			strategy: {
				need_back_test: false,
				locking: false, //现有持仓和下单统计蒙版的开关
				name: '',
				type: '',
				price: '',
				discount_price:'',
				des: {
					txt: '策略描述',
					val: '策略稳定，长期有效，条件简单'
				},
				promotion_set: {
					/*推广收益和截止日期*/
					bonus_proportion: "50",
					promote_ex_time: "465",
					promotion_money: '' /*后台自己好的推广收益*/
				},
				show_num: 9,
				base_info: [{
					txt: '作者',
					val: 'admin'
				}, {
					txt: '创建时间',
					val: '2017/06/20'
				}, {
					txt: '回测日期',
					val: '2017/06/20-2018/06/20'
				}],
				profit: [{
					txt: '年换手率',
					val: '1609.00'
				}],
				toggle_value,
				/*profit展示的数量*/
				table_data: {
					// 下单统计数据
					default_tr: -1,
					head: {
						index: "序号",
						code: "证券代码",
						codename: "名称",
						datet: "下单日期",
						fee: "交易手续费",
						num: '成交量',
						price: "成交价格",
						sell: "成交额",
						avai: "可用资金",
						shizhi: "持仓市值",
						way: "交易方向"
					},
					body: []
				},
				hold_info: { //现有持仓
					default_tr: -1,
					head: {
						index: "序号",
						code: "证券代码",
						codename: "名称",
						holdnum: "持仓量"
					},
					body: []
				}
			},
			chart_data: {
				hishow: true,
				data: {
					title: '收益1',
					dates: ['-', '-', '-', '-', '-'],
					// dates:['2013/1/24','2013/2/24','2013/3/24','2013/4/24','2013/5/24'],
					profit: [{
						name: '收益曲线',
						data: ['-', '-', '-', '-', '-']
						// data:[45,23,575,21,3]
					}]
				}
			},
			searchobj: {
				init_txt: '切换测试合约',
				init_datas: {
					list_arr: ['wrw', 'faaa', 'cccc'],
					/*搜索框的所有股票等数据*/
					ul_style: { /*下拉框的样式*/
						background: 'gray',
						display: 'block',
						color: 'white',
						width: '125%',
						maxHeight: '120px',
						textAlign: 'left',
						fontSize: '14px'
					},
					ipt_style: {
						background: '#4e4e4e'
					}
				}
			},
			agent_orders:{
				hishow:false,
				data:{}
			},
			orders: {
				hishow: false,
				data: {
					name: {
						txt: '策略名',
						code: null,
						val: '',
						disabled: false
					},
					type: {
						txt: '策略类型',
						val: '',
						disabled: false
					},
					price: {
						txt: '单价（元/月）：',
						val: '',
						disabled: true
					},
					discount_price:{
						txt: '会员折扣单价（元/月）：',
						val: '',
						disabled: true
					},
					period: {
						txt: '购买周期（月）',
						val: '',
						disabled: false
					}
				}
			},
			agent_delivery:{
				hishow:false,
				datas:{
					indicname:{
						txt:'策略名',
						val:'',
						disabled: false
					},
					SecurityID:{
						txt:'证券代码',
						val:'',
						disabled: false
					}
				}
			},
			weixin: {
				hishow: false,
				code_url: '',
				out_trade_no: '' /*订单号，微信支付的时候发送订单号，查询支付状态*/
			},
			searchDatas: {
				// 搜索框的所有股票等数据
				ipt_str: '',
				list_arr: [],
				// 下拉框的样式
				placeholder: '名称 / 代码 / 首字母',
				ipt_style: {
					height: '20px',
					paddingLeft: '5px',
					background: 'white',
					color: 'black',
					border: '1px solid gray'
				},
				ul_style: {
					background: 'gray',
					color: 'white',
					display: 'block',
					width: '100%',
					maxHeight: '120px',
					textAlign: 'left'
				}
			}
		}
	},
	computed: {
		...mapState(['c_component'])
		/* current:'STG_DETAILS',//数据结构
		datas:{
			name: "KDJT",
			type: "专家"
		} */
	},
	components: {
		profit_line: () => import('components/profit_line/profit_line.vue'),
		place_order: () => import("components/place_order/place_order.vue"),
		agent_delivery_order:()=>import("components/agent_delivery_order/agent_delivery_order.vue"),
		weixin_payment: () => import('components/weixin_payment/weixin_payment.vue'),
		input_search: () => import('components/input_search/input_search.vue'),
		agent_delivery:()=>import('./agent_delivery/agent_delivery.vue')
	},
	methods: {
		setPromoteUrl(username, stg_item) {
			// 拼接单品策略推广的url;
			const src = '/singleproduct/';
			return new Promise((resolve) => {
				this.basefn.ajaxfn(`${this.url_obj.lai_url}${src}`, 'POST', 'json', {
					username
				}, (res) => {
					console.log(res);
					console.log(stg_item);
					let href = location.protocol+'//'+location.host+location.pathname+'?';
					let search=this.basefn.queryToObj();
					// 获得查询字符串对象，遍历拼接，避免多次调用重复拼接
					let keys_arr=Object.keys(search);
					let key,val;
					for(let i=0;i<keys_arr.length;i++){
						key=keys_arr[i];val=search[key];
						if(val!=undefined){
							href+=`${key}=${val}&`
						}
					};
					const type=encodeURI(stg_item.style);
					// href += `indic_name=${stg_item.indicname}&type=${type}&SecurityID=${stg_item.SecurityID}`;
					href += `${s_indicname}=${stg_item.indicname}&${s_indic_type}=${type}&${s_SecurityID}=${stg_item.SecurityID}`;
					if(res.promoter_code){
						href+=`&${s_code}=${res.promoter_code}`
					};
					resolve(href);
				});
			});
		},
		async promoStg() {
			const input = document.createElement('input');
			let username = this.basefn.getUsername();
			if (location.href.includes('localhost')) {
				username = 'lcs11';
			};
			if (!username) {
				alert('请登录之后再试！');
				return;
			};
			// 重置url,避免用户拿到推广链接点击复制推广链接，拼接查询字符串错误（重复）
			const reset_url=this.resetUrl();
			console.log(reset_url);
			window.history.pushState(null,null,reset_url);
			const promote_url = await this.setPromoteUrl(username, {
				indicname: this.c_component.datas.name,
				style: this.c_component.datas.type,
				SecurityID: this.SecurityID
			});
			this.$el.appendChild(input);
			input.setAttribute('value', promote_url);
			input.select();
			if (document.execCommand('copy')) {
				document.execCommand('copy');
			};
			this.$el.removeChild(input);
			alert('复制推广链接成功！');
		},
		toHqPage() {
			this.$store.commit(Types.toggleComponent, {
				current: false,
				datas: {
					name: this.c_component.datas.name,
					type: this.c_component.datas.type,
					indic_type: this.c_component.datas.indic_type,
					SecurityID: this.SecurityID,
					page_from: 'stg_details'
				}
			});
			this.HomeCtnHeight(null);
		},
		login() {
			location.href = 'https://nujin.com/';
		},
		initSearchPools() {
			// search_pools
			/*给input的下拉列表请求缓存数据*/
			let list = sessionStorage.searchlist;
			console.log(list==='undefined');
			if (list != undefined && list!='undefined') {
				this.searchDatas.list_arr = JSON.parse(list);
			} else {
				const src = '/get_code_list/';
				this.basefn.ajaxfn(`${this.url_obj.lai_url}${src}`, "POST", "json", {
					c_board: 'all'
				}, (res) => {
					console.log(res);
					sessionStorage.searchlist = JSON.stringify(res.data);
				});
			};
		},
		getIptTxt(self, data) {
			//获得搜索结果，切换证券代码，重新刷新数据
			console.log(data.split(' '));
			console.log(data);
			if (data.split(' ').length > 0) {
				this.searchDatas.ipt_str = data.split(' ')[0];
				this.SecurityID = this.searchDatas.ipt_str;
			};
			this.getAllStg();
		},
		actionWeixin(self, datas) {
			// 微信组件显示触发函数
			//hishow为控制开关，其它是需要的参数
			console.log(datas);
			const {
				code_url,
				out_trade_no,
				pay_by,
				pay_tag,
				hishow,
				total_price
			} = datas;
			this.weixin = {
				code_url,
				out_trade_no,
				hishow,
				total_price
			};
			if(pay_tag==='agent_delivery' && hishow===true){
				this.getPaymentResult(pay_by,out_trade_no)
			}
		},
		getPaymentResult(pay_by,out_trade_no){
			let data = {
					out_trade_no
				};
			const src = `/order/daifa_callback/${pay_by}/`;
			this.basefn.ajaxfn(`${this.url_obj.shuo_url}${src}`, 'POST', 'json', data, async (res) => {
				if(res.result==='success' || this.weixin.hishow!==true){
					this.weixin = {
						code_url:'',
						out_trade_no:'',
						hishow:false
					};
					return
				};
				await this.basefn.sleep(2000);
				this.getPaymentResult(pay_by,out_trade_no);
			})
		},
		followWxAccount(self, datas) {
			// 关注公众号
			const {
				hishow
			} = datas;
			console.log(datas);
			// return;
			this.weixin = {
				hishow,
				code_url: 'https://aupool.cn/static/img/wxsubscription_1.c5a6194.jpg',
				out_trade_no: ''
			};
		},
		handleAgent(child_data){
			// 代理转发的逻辑
			console.log(child_data);
			if(child_data?.hishow===false){
				this.agent_delivery.hishow=false;
				this.$store.commit(Types.setLocationEl, {
					element: null
				});
				return
			};
			let username = this.basefn.getUsername();
			if (location.href.includes('localhost')) {
			  username = 'lcs11';
			};
			if(username===false){
			  alert('请登录之后再试')
			  return;
			};
			this.agent_delivery.hishow=!this.agent_delivery.hishow
			if(this.agent_delivery.hishow===true){
				this.$store.commit(Types.setLocationEl, {
					element: this.$el
				});
				this.agent_delivery.datas={
					indicname:{
						txt:'策略名',
						val:this.c_component.datas.name,
						disabled: false
					},
					SecurityID:{
						txt:'证券代码',
						val:this.strategy.profit[0] ? this.strategy.profit[0].val : null,
						disabled: false
					}
				}
			}
		},
		AgentDeliveryOrder(self,{hishow,order_list}){
			// 代理转发中支付命令，触发的函数
			this.$store.commit(Types.setLocationEl, {
				element: this.$el
			});
			this.agent_orders = {
				hishow,
				data:{
					order_list:{
						txt:'订单号',
						val:order_list
					}
				}
			};
		},
		placeOrder(hishow = true) {
			// 立即购买
			/* console.log(Types);
			console.log($(this.$el)); */
			this.$store.commit(Types.setLocationEl, {
				element: this.$el
			});
			// 证券代码
			let code = this.strategy.profit[0] ? this.strategy.profit[0].val : null;
			const orders = {
				hishow,
				data: {
					name: {
						val: this.c_component.datas.name,
						code,
						txt: '策略名',
						disabled: false
					},
					type: {
						txt: '策略类型',
						val: this.c_component.datas.type,
						disabled: false
					},
					price: {//如果discount_price不是undefined,price的描述字段就是会员折扣价
						txt: this.strategy.discount_price!==undefined ? '会员折扣单价（元/月）：':'单价（元/月）：',
						val: this.strategy.price,
						disabled: true,
						hishow:true
					},
					discount_price:{
						//如果discount_price是undefined,就显示会员折扣价的字段，引导用户成会员，否则不显示，通过hishow控制
						txt: '会员折扣单价（元/月）：',
						val: this.strategy.price*0.9.toFixed(2),
						disabled: true,
						hishow:this.strategy.discount_price===undefined ? true:false
					},
					period: {
						txt: '购买周期（月）',
						val: '12',
						disabled: false
					}
				}
			};
			/* if(this.strategy.discount_price===undefined){
				
				this.original_price={
					txt: '会员折扣单价（元/月）：',
					val: this.strategy.price*0.1.toFixed(4),
					disabled: true
				},
			}; */
			console.log(orders.data);
			if (this.c_component.datas.type === '荐股') {
				orders.data.price.txt = "单价（元/月）：";
				orders.data.period.txt = "购买周期（月）：";
				orders.data.period.val = "";
				orders.data.period.disabled = false;
			};
			this.orders = orders;
		},
		profitList() {
			/*查看更多收益统计*/
			if (this.strategy.toggle_value == toggle_value) {
				this.strategy.toggle_value = '隐藏数据';
				this.strategy.show_num = 1000;
			} else {
				this.strategy.toggle_value = toggle_value;
				this.strategy.show_num = 9;
			};
			this.HomeCtnHeight();
		},
		toggleComponent(cpt_name, item) {
			this.$store.commit(Types[cpt_name], {
				// stg_details,必须和index.js引入的组件名保持一致
				current: false,
				datas: {
					name: this.c_component.datas.name,
					type: this.c_component.datas.type,
					indic_type: this.c_component.datas.indic_type,
					SecurityID: this.SecurityID,
					page_from: 'stg_details'
				}
			});
			this.HomeCtnHeight(null);
		},
		getAuthorType(){
			const data = {
				username: this.basefn.getUsername(),
				type:1
			},src = '/account/get_author_type/';
			// this.SecurityID=data.code;
			if(location.href.includes('localhost')){data.username='nujin'}
			if (data.username===false) {
				return;
			};
			this.basefn.ajaxfn(`${this.url_obj.shuo_url}${src}`, 'POST', 'json', data, (res) => {
				this.vip_level=res.vip_level!=='' ? true : false;
			})
		},
		getAllStg(callback, retestsign = false) {
			/*初始化策略详细数据*/
			const {
				datas
			} = this.c_component;
			// console.log(datas);
			let data = {
					username: this.basefn.getUsername(),
					indicname: datas.name,
					retestsign,
					sort: 1,
					code: this.searchDatas.ipt_str
				},
				src = '/quan_language/getIndicatorDetail/';
			// this.SecurityID=data.code;
			if (sort_id !== undefined) {
				data.indicname = ''
			};
			this.basefn.ajaxfn(`${this.url_obj.shuo_url}${src}`, 'POST', 'json', data, (res) => {
				console.log(res);
				sort_id = undefined;
				// console.log(data.retestsign);
				if (data.retestsign === true) return; /*触发后台接口,计算收益曲线,前台不刷新 */
				const {
					promotion_money,
					trade_info,
					price,
					discount_price,
					result,
					description,
					profit,
					base_info,
					resdata,
					DATETIME,
					promotion_set,
					profit_picture,
					retestsign,
					code,
					indicname,
					hold_info,
					locking,
					need_back_test
				} = res;
				// this.SecurityID=code;
				// this.searchDatas.ipt_str=code;
				this.profit_picture = profit_picture;
				// console.log(result);
				this.c_component.datas.name = indicname;
				// console.log(code);
				if (result == 'ok') {
					this.strategy.need_back_test = need_back_test;
					this.strategy.hold_info.body = hold_info ? hold_info : [];
					this.strategy.price = price;
					this.strategy.discount_price = discount_price;
					this.strategy.promotion_set = promotion_set == undefined ? {} : promotion_set;
					this.strategy.promotion_set.promotion_money = promotion_money;
					this.strategy.des.val = description;
					this.strategy.profit = [];
					this.strategy.base_info = [];
					this.strategy.locking = locking;
					if (base_info && base_info.length > 0) {
						/* for(let item of base_info){
	     					this.strategy.base_info.push(item);
	     				}; */
						this.strategy.base_info = base_info;
						this.strategy.type = base_info[1].val;

						callback && callback();
					};
					if (profit && profit.length > 0) {
						for (let item of profit) {
							this.strategy.profit.push(item);
						};
						this.searchobj.init_txt = profit[0].val;
						this.SecurityID = this.searchobj.init_txt.split(' ')[0];
						this.searchDatas.ipt_str = this.searchobj.init_txt;
					};
					console.log(this.strategy);
					// 如果后台返回的是true,则重新触发当前接口,计算回测收益,更新收益数据,默认参数改为true,前台不做任何处理;
					if (retestsign == "true") {
						this.getAllStg(null, true)
					};
					if (this.strategy.type == '专家' || this.strategy.type == '金池') {
						if (resdata) {
							this.chart_data.data = {
								dates: DATETIME,
								title: '收益曲线',
								name: this.strategy.name,
								type: this.strategy.type,
								profit: resdata.reverse()
							}
						};
						if (trade_info && trade_info.length > 0) {
							const order_details = [];
							for (const {
									index,
									code,
									codename,
									"datet": order_d,
									fee,
									num,
									price,
									sell,
									shizhi,
									way,
									avai
								} of trade_info) {
								order_details.push({
									index,
									code,
									codename,
									order_d,
									fee,
									num,
									price,
									sell,
									avai: avai,
									shizhi,
									way
								})
							};
							this.strategy.table_data.body = order_details;
						} else {
							this.strategy.table_data.body = [];
						};
					} else if (this.strategy.type == '指标') {
						if (resdata) {
							this.chart_data.data = {
								dates: DATETIME,
								title: '指标曲线',
								name: this.strategy.name,
								type: this.strategy.type,
								profit: resdata
							}
						}
					};
					console.log(this.strategy.hold_info);
				}else{
					// 本地测试注释掉下面的代码，生产打开
					// alert(res.reason)
				}
			})
		},
		resetUrl(reset_list=[s_indicname,s_indic_type,s_SecurityID,s_code]){
			//用户通过外部链接进入详情页，需要重置查询字符串，
			//防止用户重新点击复制推广链接导致查询字符串拼接错误；
			//也可以在用户点击复制推广链接时，首先重置查询字符串
			let href = location.protocol+'//'+location.host+location.pathname;
			let search=this.basefn.queryToObj();
			
			let keys_arr=Object.keys(search);
			let key,val;
			if(keys_arr.length>0){}
			for(let i=0;i<keys_arr.length;i++){
				key=keys_arr[i];val=search[key];
				//查看是否包含需要重置的字段，以及对应的值是否为undefined;
				if(reset_list.includes(key)||val===undefined){
					continue;
				};
				//如果重置完字段，没有需要拼接的查询字符串，则href的末尾不需要'？'
				if(!href.includes('?')){href+='?'};
				//如果是最后一个要拼接的查询字符串，后面不能接'&'这个符号
				href+=`${key}=${val}&`
			};
			//去除href最后面的'&';
			const last_index=href.length-1;
			if(href[last_index]==='&'){
				href=href.substr(0,last_index);
			};			
			return href;
		},
		HomeCtnHeight(home_height) {
			// 相对定位父盒子的高度
			this.$nextTick(() => {
				// console.log($(this.$el).height());
				setTimeout(() => {
					this.$store.commit(Types.setHomeHeight, {
						home_height: home_height ? home_height : $(this.$el).height()
					});
				}, 200)
			})
		},
		closeModel(datas){
			// 关闭模态框函数
			console.log(datas);
			for(let key in datas){
				this[key].hishow=datas[key].hishow;
			}
		}
	},
	created() {
		// 使用切换时传递过来的SecurityID，作为收益统计的对象；
		console.log(this.c_component.datas);
		if (!this.basefn.IsPC) {
			this.searchDatas.ipt_style.width = '130px'
		};
		this.searchDatas.ipt_str = this.c_component.datas.SecurityID;
		console.log(this.searchDatas.ipt_str);

		// 如果路由上有code,则以路由上的code为准
		const {
			code,
			'sort_id': url_sort_id
		} = this.basefn.queryToObj();
		if (code) {
			this.searchDatas.ipt_str = code
		};
		if (url_sort_id !== undefined) {
			// 根据努金发帖传递过来url,查看是否有sort_id,如果sort_id有值，则getAllStg的data中indicname为空字符串
			sort_id = url_sort_id;
		};
		this.getAuthorType();
		this.getAllStg();
		// this.initSearchPools();
	},
	mounted() {
		this.$on('closeModel',this.closeModel)
		this.HomeCtnHeight();
	}
}
