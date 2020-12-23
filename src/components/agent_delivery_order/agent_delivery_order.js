export default {
	name: 'placeorder',
	/*策略下单*/
	data: function() {
		return {
			shuo_url: '',
			order_data: null,//订单号等信息
			order_obj:null,//待支付订单的详细信息
			url: null,
			select_datas: {
				head_txt: '代理转发支付',
				styleobj: { /*如果传递了bottom,初始位置就以bottome为准，否则初始位置就居中*/
					'minWidth': '300px',
					'height': '140px',
					'background': 'white',

					/*背景颜色*/
					'multiple': {
						scale_x: 0.8,
						scale_y: 0.8
					},
					/*最大化宽高是屏幕的倍数*/
					'mainsec_padding': {
						'padding': '40px 10px 10px 10px'
					}
				}
			},
			status: '',
			pay_type: {
				def: 0,
				list: [{
					txt: '微信',
					val: 'weixin_pay',
					cls: 'payment iconfont iconweixin'
				},{
					txt: '支付宝',
					val: 'ali_pay',
					cls: 'payment iconfont iconzhifubao'
				}]
			}
		}
	},
	props: {
		order_list: {
			type: Object,
			default: function() {
				return {
					price: {
						txt: '价格:',
						val: '465'
					},
					period: {
						txt: '购买周期:',
						val: 100
					}
				}
			}
		}
	},
	components: {
		place_order: () => import("components/pop_over/pop_over.vue")
	},
	methods: {
		handlePayType(i) {
			this.pay_type.def = i;
		},
		li_hishow(val) {
			let show = true;
			if (val == 'name' || val == 'type') {
				show = false;
			};
			return show
		},
		close(reload) {//reload:是否重新刷新页面的标记
			this.$emit('closeOrderBoard');
			if(reload===true){
				location.href=location.href;
			}
		},
		triggerHttp(method, data) {
			const src = `/order/get_order_fee/`;
			return new Promise((resolve) => {
				this.basefn.ajaxfn(`${this.url_obj.shuo_url}${src}`, method, 'json', data, (res) => {
					console.log(res);
					resolve(res);
				})
			})
		},
		getUsername(){
			let username = this.basefn.getUsername();
			if(location.href.includes('localhost')){
				username='nvjan';
			}else{
				if (!username) {
					username='';
				};	
			};
			return username;
		},
		async init_data() {
			this.order_data = this.order_list;
			const res=await this.triggerHttp('POST',{
				username:this.getUsername(),
				orders:JSON.stringify(this.order_data.order_list.val)
			});
			if(res.result==='success'){
				this.order_obj=res.data;
			};
		},
		getPaymentUrl() {
			const {
				order_list:{val}
			} = this.order_data;
			let promoter_id = undefined;
			const {
				def,
				list
			} = this.pay_type;
			const src = `/order/daifa_pay/`;
			let p_single_code=this.basefn.queryToObj().s_code;
			if(window.s_code){p_single_code=window.s_code};
			let data = {
				username:this.getUsername(),
				pay_by:list[def].val,
				orders:JSON.stringify(val)
			};
			if(p_single_code){
				data.p_single_code=p_single_code
			};
			this.basefn.ajaxfn(`${this.url_obj.shuo_url}${src}`, 'POST', 'json', data, (res) => {
				const {
					result,
					reason,
					url,
					data,
					code_url,
					out_trade_no,
					bind_wx,
					mweb_url
				} = res;
				if(mweb_url){
					location.href=mweb_url;
					return;
				};
				if (result == 'error') {
					this.status = reason;
					setTimeout(() => {
						this.status = '';
					}, 3000)
				} else if (result == 'ok') {
					console.log(navigator.userAgent);	
					if(location.href.includes('localhost') && data){
						console.log(data);
						wxAction(data,out_trade_no)
						return;
					}
					if (list[def].txt == '支付宝') {
						location.href = url;
					} else if (list[def].txt == '微信') {
						this.$emit('actionWeixin', {
							pay_by:list[def].val,
							code_url,
							pay_tag:'agent_delivery',
							out_trade_no,
							hishow: true
						});
						this.$parent.$emit('closeModel',{
							agent_orders:{hishow:false}
						})
					}
				}else {
					this.status = `${result}。您已订阅了跟单信号，请关注公众号！`;
					setTimeout(() => {
						this.status = '';
					}, 8000)
				}
			})
		}
	},
	created() {
		this.init_data();
		if(!this.basefn.IsPC){
			this.pay_type.list=[{
					txt: '微信',
					val: 'weixin_pay',
					cls: 'payment iconfont iconweixin'
				},{
					txt: '支付宝',
					val: 'ali_pay',
					cls: 'payment iconfont iconzhifubao'
				}]
		}
	},
	beforeDestroy(){
		clearTimeout(this.$el.timer);
	}
}
