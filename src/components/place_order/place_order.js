export default {
	name: 'placeorder',
	/*策略下单*/
	data: function() {
		return {
			shuo_url: '',
			order_data: null,
			url: null,
			select_datas: {
				head_txt: '购买策略',
				styleobj: { /*如果传递了bottom,初始位置就以bottome为准，否则初始位置就居中*/
					'minWidth': '300px',
					'height': '280px',
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
		//调起微信
		onBridgeReady(data,out_trade_no,callback) {
		   WeixinJSBridge.invoke(
			  'getBrandWCPayRequest', data,
			  function(res){
			  if(res.err_msg == "get_brand_wcpay_request:ok" ){
				  const src = `/quan_language/ceshi/`;
				  this.basefn.ajaxfn(`${this.url_obj.shuo_url}${src}`, 'GET', 'json', data, (res) => {
				});
			  }else{
			  }
		   });
		   // import('../../pages/utils.js').then(async (utils)=>{
		   // 	const getPaymentResult=utils.getPaymentResult.bind(this);
		   // 	const result=await getPaymentResult(out_trade_no);
		   // 	if(result===true){
		   // 		[callback].call(this,true);
		   // 	}
		   // });
		},
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
		init_data() {
			this.order_data = this.order_list;
			console.log(this.order_data);
		},
		getPaymentUrl() {	
			const {
				name,
				period,
				price
			} = this.order_data;
			let username = this.basefn.getUsername();
			/* if(location.href.includes('localhost')){
				
				username='lcs11';
			}else{
				if (!username) {
					alert('用户未登录，请登录后再试');
					return;
				};	
			}; */
			if(location.href.includes('localhost')){
				username='lcs11';
			}else{
				if (!username) {
					username='';
				};	
			};
			let promoter_id = undefined;
			const {
				def,
				list
			} = this.pay_type;
			const src = `/${list[def].val}/pay/`;
			const code=name.code?name.code.trim().split(' ')[0]:undefined;
			let p_single_code=this.basefn.queryToObj().s_code;
			if(window.s_code){p_single_code=window.s_code};
			let data = {
				code,
				indicname: name.val,
				username,
				buy_time: period.val
			};
			if(p_single_code){
				data.p_single_code=p_single_code
			};
			if (!(Number.parseFloat(data.buy_time) >= 0)) {
				alert('购买周期不合法！');
				return;
			};
			console.log(data);
			this.basefn.ajaxfn(`${this.url_obj.shuo_url}${src}`, 'POST', 'json', data, (res) => {
				console.log(res);
				/* code_url：生成二维码的数据；
				 * out_trade_no：订单号，微信支付的时候发送订单号，查询支付状态
				 *
				 * */
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
				/* if(bind_wx===false){
					// 1.如果bind_wx为false,说明没有关注公众号;
					// 2.弹出关注公众号二维码；
					// 3.再次扫二维码，关注公众号
					this.status = '请关注公众号后，购买策略！';
					this.$emit('actionWeixin', {
						hishow: true,
						code_url:'https://aupool.cn/static/img/wxsubscription_1.c5a6194.jpg',
						out_trade_no:'wx_gzh'
					})
					return;
				}; */
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
						
					}else if(navigator.userAgent.includes('MicroMessenger') && data){
						console.log(data);
						/* const wxAction=wxAction.bind(this);
						const close=this.close.bind(this); */
						// wxAction.call(this,data,out_trade_no,this.close);
						this.onBridgeReady(data,out_trade_no,this.close);
						return;
					};
					
					if (list[def].txt == '支付宝') {
						location.href = url;
					} else if (list[def].txt == '微信') {
						console.log(code_url);
						this.$parent.placeOrder(false);
						this.$emit('actionWeixin', {
							total_price:period.val*price.val,
							code_url,
							out_trade_no,
							hishow: true
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
