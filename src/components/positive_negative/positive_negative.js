import {
	negative_assets,
	promote_des
} from './promotion_des.js';
const reset_indic = {
	indicname: '--',
	rate: '--',
	img: '购买'
};

const reset_score = {
	positive: '点击查看多头策略',
	negative: '点击查看空头策略'
};
export {
	reset_indic
};
export default {
	name: 'positive_negative', //量化专家诊股
	data: function() {
		return {
			lai_url: null,
			username: null,
			btn_obj: {
				active: null,
				list: {
					up: '多头策略',
					down: '空头策略'
				}
			},
			style_obj: {
				positive: 50,
				negative: 50
			},
			code: null,
			order_data: null
		}
	},
	props: {
		positive_datas: {
			type: Object,
			/* default:function(){
			  return {
				  code:'000001.SZ'
			  }
		  } */
		}
	},
	computed: {
		strategy_des() {
			const {
				active,
				list
			} = this.btn_obj;
			if (active === null) {
				return '所有策略'
			} else {
				return list[active];
			}
		},
		styleDatas() {
			let {
				positive,
				negative
			} = this.style_obj;
			let advice_data = {
				des: '',
				styleobj: {
					'color': ''
				}
			};
			const setDes = function(advice_des, color = '') {
				// 根据positive是否有number值，以及大小写决定advice_data的描述和样式；
				const num = Number.parseInt((20 * Math.random()));
				return {
					advice_des,
					des: negative_assets[promote_des][num],
					styleobj: {
						'color': color
					}
				};
			};
			const _filterMinVal = function() {
				const limit = 22;
				let des = '',color = '';
				if ((typeof positive) !== 'number' || (typeof negative) !== 'number') {
					const init_des=positive;
					positive = 50;
					negative = 50;
					color = '';
					des = init_des;
				} else {
					if (positive < limit) {
						positive = limit;
						negative = 100 - limit;
					};
					if (negative < limit) {
						negative = limit;
						positive = 100 - limit;
					};
					if (positive > negative) {
						color = '#e46a5e';
						des = '多头走势，可买入、持有或加仓。'
					} else if (positive < negative) {
						color = '#7bd25f';
						des = '空头走势，可空仓、卖出或等待抄底'
					};
					if ((positive > 40 && positive < 60) || (negative > 40 && negative < 60)) {
						des = '多空相当，震荡走势，可以高抛低吸。'
						color = positive > negative ? '#e46a5e' : '#7bd25f';
						if (positive === negative) {
							color = ''
						};
					};
				};
				advice_data = setDes(des, color);
			};
			_filterMinVal();

			const style_obj = {
				p_style: {
					'width': `${positive}%`,
					'backgroundColor': '#e46a5e'
				},
				n_style: {
					'width': `${negative}%`,
					'backgroundColor': '#7bd25f'
				},
				advice_data
			};

			return style_obj
		}
	},
	watch: {
		positive_datas: {
			deep: true,
			immediate: true,
			handler: function(newval, oldval) {
				this.code = newval.code;
				this.lai_url = this.url_obj.lai_url;
				this.username = this.basefn.getUsername();
				this.investmentAdvice();
			}
		}
	},
	methods: {
		login(){
			console.log(this.basefn.IsPC);
			if(this.basefn.IsPC===true){
				location.href='https://nujin.com/';
			}else{
				location.href='https://nujin.com/member.php?mod=logging&action=login&mobile=2'
			}
		},
		applyVip() {
			window.open('https://nujin.com/plugin.php?id=hl_vip');
		},
		getBtnActive() {
			return this.btn_obj.active
		},
		getIndicators() { //微信支付完成后，获得当前选中多空的数据
			const type = this.$parent.getDefaultIndic();
			// 获得多空比例和策略排行的数据
			this.investmentAdvice(this.btn_obj.active, type);
		},
		getPaymentUrl() {
			//量化专家诊股购买按钮
			const order_data = this.order_data;
			const src = `/investment_wx_pay/`;
			const code = this.code;
			let username = this.basefn.getUsername();
			console.log(username);
			if (location.href.includes('localhost')) {
				username = 'lcs11';
			};
			if (!username) {
				alert('请登录后再试！')
				return;
			};
			const type = 0;
			let data = {
				buy_time: order_data.list[order_data.def].time.substr(0, 1),
				code,
				username,
				type
			};
			this.basefn.ajaxfn(`${this.lai_url}${src}`, 'POST', 'json', data, (res) => {
				console.log(res);
				/* code_url：生成二维码的数据；
				 * out_trade_no：订单号，微信支付的时候发送订单号，查询支付状态
				 * */
				const {
					result,
					reason,
					url,
					code_url,
					out_trade_no
				} = res;
				if (result == 'error') {
					this.status = reason;
					setTimeout(() => {
						this.status = '';
					}, 3000)
				} else if (result == 'ok') {
					this.$emit('actionWeixin', {
						hishow: true,
						datas: {
							code,
							code_url,
							out_trade_no
						}
					})
				} else {
					this.status = result;
					setTimeout(() => {
						this.status = '';
					}, 3000)
				}
			})
		},
		getCurrentData() {
			return {
				up_down: this.btn_obj.active
			}
		},
		handleIndicator(up_down) {
			// 点击多空策略按钮，如果为null,值更新为点击按钮的up_down,
			//否则重置为null
			this.btn_obj.active = !this.btn_obj.active ? up_down : null;
			// 获得多空比例和策略排行的数据
			this.investmentAdvice();
		},
		resetDatas(datas) {
			// 切换标的，重置多空百分比，隐藏购买按钮和价格；
			console.log(datas);
			if (datas !== undefined) {
				this.style_obj = {
					positive: datas.up_score,
					negative: datas.down_score
				}
			} else {
				this.style_obj = reset_score
			};
			console.log(this.style_obj);
			this.btn_obj.active = null;
			this.order_data = null;
		},
		async investmentAdvice() {
			const data = {
				code: this.code,
			};
			const {
				up_down,
				indic_name
			} = this.basefn.getherDatas.call(this, 'getCurrentData', 'getherDatas');
			// this.username='lcs11';
			if (this.username === false || up_down === null || up_down === undefined) {
				if (this.username === false && up_down !== null) {
					this.resetDatas({
						up_score: '请登录后查看',
						down_score: ''
					});
				};
				this.$parent.initIndicators();
				return;
			} else {
				// 如果多空状态，也就是非null状态
				Object.assign(data, {
					username: this.username,
					param: up_down,
					type: indic_name
				});
			};
			const url = '/investment_advice/';
			const res_obj = await new Promise((resolve) => {
				this.basefn.ajaxfn(`${this.lai_url}${url}`, "POST", "json", data, (res) => {
					console.log(res);
					resolve(res);
				})
			});
			this.handleData(res_obj, data.param);
		},
		handleData(res_obj, up_down) {
			// 1.处理多空比例数据
			if (res_obj.up_score != undefined) {
				this.style_obj = {
					positive: res_obj.up_score,
					negative: res_obj.down_score
				}
			};
			if (res_obj.list) {
				res_obj.list.map((item => {
					console.log(item, up_down);
					item.type = up_down;
				}))
				console.log(res_obj.list);
				// this.$parent.handle(new_arr);
				this.$parent.handle(res_obj.list);
			} else {
				this.$parent.handle([]);
				if (res_obj.error) {
					this.style_obj = {
						positive: res_obj.error,
						negative: res_obj.error
					}
				}
			};
			if (res_obj.result === '请开通vip或购买后查看' || res_obj.result === '已过期，请购买后查看') {
				// 3.购买需要展示的周期,价格数据;
				this.order_data = {
					def: 0,
					list: res_obj.data
				};
				alert(res_obj.result);
			} else {
				this.order_data = null;
			}
		}
	},
	created() {
		this.lai_url = this.url_obj.lai_url;
	}
}
