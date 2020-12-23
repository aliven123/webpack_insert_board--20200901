import {mapState} from 'vuex';

const chart_head = '收益图';
const show_item = 3;
export default {
	name: 'rank_indicators',
	/* 股票切换到k线页面增加指标展示 */
	data: function() {
		return {
			indicators: {
				head: {
					rate: {
						txt: '综合排序'
					},
					indicname: {
						txt: '策略'
					},
					img: {
						txt: chart_head
					}
				},
				head_arr: null,
				/* 根据head的key自动决定渲染多少列 */
				tbody: [{}],
				show_item, //策略排行默认显示的条数，点击更多，show_item的长度为数据的长度
			},
			indic_pool: {
				type: '综合排序',
				list: [
					'综合排序',
					'风险率',
					'最终权益',
					'标准离差',
				]
			},
			code: null,
			positive_datas: {//多空数据条组件的数据
				code: null
			},
			wx_pay:{
				// 量化专家诊股，购买微信二维码数据
				hishow:false,
				status:'微信扫码支付!'
			}
		}
	},
	props: {
		init_obj: {
			type: Object
		}
	},
	computed: {
		...mapState(['c_component']),
		initDatas() {
			return this.init_obj;
		}
	},
	watch: {
		c_component:{
			deep:true,
			immediate:true,
			handler(newval,oldval){
				console.log(newval,oldval);
				if(newval.datas?.page_from==='stg_details'){
					if(newval.datas.indic_type==undefined){
						this.locationIndicator(this.indic_pool.type);
					}else{
						this.locationIndicator(newval.datas.indic_type);
					}
				}
			}
		},
		initDatas: {
			deep: true,
			immediate: true,
			handler(newval, oldval) {
				// newval是包含证券代码的字典
				this.code = newval.code;
				this.positive_datas = {
					code: newval.code
				};
				// this.initIndicators()
			}
		}
	},
	components: {
		positive_negative: () => import('../positive_negative/positive_negative.vue'),
	},
	methods: {
		/* getInfoFromUrl(){
			// 从niujin.com的诊股中跳转过来，获取数据,跳转到模板的详情页；
			const queryData=this.basefn.queryToObj();
			queryData.s_indic_type=decodeURI(queryData.s_indic_type);
			console.log(queryData);
			if(queryData.s_indicname && queryData.s_SecurityID && queryData.s_indic_type){
				if(queryData.s_code ){window.s_code=queryData.s_code};
				this.resetParams();
				this.toggleComponent('toggleComponent',{
					indicname:queryData.s_indicname,
					SecurityID:queryData.s_SecurityID,
					indic_type:queryData.s_indic_type
				});
			}
		}, */
		/* resetParams(){ 
			// 重置url函数
			
			// 搜索引擎诊股通过url传递过来的参数,获取参数值之后重置,
			// 避免策略详情页,返回到首页,getInfoFromUrl在生命周期中被重复调用,跳转失效
			
			let reset_href=location.href.match(/(^http.+[^?])\?/)[1];
			console.log(reset_href);
			window.history.replaceState({},'搜金股',reset_href);
		}, */
		locationIndicator(type){
			console.log(type);
			this.indic_pool.type = type;
			this.indicators.head.rate.txt = type;
		},
		async checkPayment(obj,[callBack,...params]){
			// 策略排行内部触发到当前函数；需要在board,nav_list对应模板注册
			const {getPaymentResult,sleep}=await import('../../pages/utils.js');
			this.$el.result={payment:false};
			const getResult=async()=>{
				// 查询支付结构的递归函数
				console.log(this.$el.result);
				if(this.$el.result && this.$el.result.payment===true){
					// 跳出循环
					console.log(callBack,params)
					this[callBack](params);
				}else if(this.$el.result?.payment===false && this.wx_pay.hishow){
					this.$el.result=await getPaymentResult.call(this,obj.out_trade_no);
					await sleep.call(this,1000);
					getResult();
				}
			};
			getResult();
		},
		async actionWeixin(self,datas){
			console.log(datas);
			clearTimeout(this.$el.timer);
			const {hishow,"datas":obj}=datas;
			this.wx_pay.hishow=hishow;
			this.$el.result=null;
			if(hishow===true){
				const {showWeixinPayment,getPaymentResult,sleep}=await import('../../pages/utils.js');
				showWeixinPayment.call(this,obj.code_url);
				this.checkPayment(obj,['wxPaymentHandler',1,2]);
			};
			console.log(3);
		},
		wxPaymentHandler(){
			// 微信支付成功的回调，重新刷新多头/口头策略的列表；
			this.wx_pay.hishow=false;
			this.$refs.positive_negative.investmentAdvice();
		},
		
		getDefaultIndic() {
			// 在positive_negative中获得当前默认策略
			return this.indic_pool.type;
		},
		getherDatas() {
			// 在positive_negative中获得当前默认策略
			const datas={indic_name:this.indic_pool.type}
			return datas;
		},
		toggleType(type) {
			const datas=this.basefn.getherDatas.call(this,'getherDatas','getCurrentData','positive_negative');
			this.indic_pool.type = type;
			this.indicators.head.rate.txt = type;
			this.initIndicators()
		},
		showAllIndicators() {
			// 策略排行展示行数是否全部显示的切换；
			if (this.indicators.show_item === show_item) {
				this.indicators.show_item = this.indicators.tbody.length;
			} else {
				this.indicators.show_item = show_item;
			}
		},
		handle(list,order_data){
		  // 在positive_negative中点击多空按钮更新策略排行列表；
		  this.indicators.head_arr=Object.keys(this.indicators.head);
		  this.indicators.tbody=list;
		},
		initIndicators() {
			// 1.多空比例数据和策略数据函数，初始化，在positive_negative组件中被初始化后调用
			// 
			// console.log(this.basefn.getUsername(),'ssssssssssssssssssss');
			const url = '/indicator_profit/';
			let type=decodeURI(this.indic_pool.type);
			if(type==='综合排序'){type='综合评分'};
			const data = {
				code: this.code,
				type
			};
			if(!data.type){
				// 从详情页返回无法拿到数据，则策略排行过滤条件默认选中第一项；
				const type=this.indic_pool.list[0];
				this.indic_pool.type = type;
				this.indicators.head.rate.txt = type;
				data.type=type;
			};
			let username;
			if(location.href.includes('localhost')){
				username='lcs11';
			}else{
				username=this.basefn.getUsername();
			};
			Object.assign(data,{username});
			if (data.code == '' || data.code == undefined) return;
			this.basefn.ajaxfn(`${this.url_obj.lai_url}${url}`, "GET", "json", data, (res) => {
				console.log(res);
				let {
					result,
					down_score,
					up_score
				} = res;
				// 1.加载策略数据/或重置策略数据
				this.indicators.head_arr = Object.keys(this.indicators.head);
				if (result instanceof Array && result.length >= 0) {
					this.indicators.tbody = result;
				}else{
					this.indicators.tbody=[];
					alert(result);
				};
				//2.加载多空百分比数据
				if(down_score!==undefined){
					down_score=down_score===''?up_score:down_score;
					this.$refs.positive_negative.resetDatas({down_score,up_score});
				}else{
					this.$refs.positive_negative.resetDatas({down_score:'点击查看多头策略',up_score:'点击查看空头策略'});
				};
			})
		},
		toggleComponent(cpt_name, item) {
			import('store/types.js').then(Types => {
				this.$store.commit(Types[cpt_name], {
					// stg_details,必须和index.js引入的组件名保持一致
					current: Types.STG_DETAILS,
					datas: {
						name: item.indicname,//点击的策略名
						type: '专家',
						SecurityID: this.code,
						indic_type:this.indic_pool.type,//当前策略列表的过滤条件
						page_from:''
					}
				})
			})

		},
		toggleComponent(cpt_name, item) {
			import('store/types.js').then(Types => {
				this.$store.commit(Types[cpt_name], {
					// stg_details,必须和index.js引入的组件名保持一致
					current: Types.STG_DETAILS,
					datas: {
						name: item.indicname,//点击的策略名
						type: '专家',
						SecurityID: item.SecurityID ? item.SecurityID:this.code,
						indic_type:this.indic_pool.type,//当前策略列表的过滤条件
						page_from:''
					}
				})
			})
		
		}
	},
	created(){
		// this.getInfoFromUrl();
	},
	beforeDestroy(){
		this.wx_pay.hishow=false;
	}
}
