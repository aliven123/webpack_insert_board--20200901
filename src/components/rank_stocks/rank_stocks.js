import {mapState} from 'vuex';
const show_item = 3;
const total_item=20;
const chart_head = '收益图';
export default {
	name: 'rank_stocks',
	/* 股票切换到k线页面增加指标展示 */
	data: function() {
		return {
			indicators: {
				head: {
					code: {
						txt: '代码'
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
					'标准离差'
				]
			},
			code: null,
		}
	},
	methods: {
		toggleType(type) {
			this.indic_pool.type = type;
			this.initList()
		},
		initList() {
			const url='/ng_search/';
			let type = this.indic_pool.type;
			if (type === '综合排序') {
				type = '综合评分'
			};
			const data={type};
			this.basefn.ajaxfn(`${this.url_obj.lai_url}${url}`, "POST", "json", data, (res) => {
				console.log(res);
				let {
					result
				} = res;
				// 1.加载策略数据/或重置策略数据
				this.indicators.head_arr = Object.keys(this.indicators.head);
				if (result instanceof Array && result.length > 0) {
					this.indicators.tbody = result.slice(0,total_item);
				} else {
					this.indicators.tbody = [{}];
					alert('牛股排行,'+result);
				};
				console.log(this.indicators.tbody);
			})
		},
		showAllIndicators() {
			// 策略排行展示行数是否全部显示的切换；
			if (this.indicators.show_item === show_item) {
				this.indicators.show_item = this.indicators.tbody.length;
			} else {
				this.indicators.show_item = show_item;
			}
		},
		toggleComponent(cpt_name, item) {
			// console.log(item);
			// return;
			import('store/types.js').then(Types => {
				this.$store.commit(Types[cpt_name], {
					// stg_details,必须和index.js引入的组件名保持一致
					current: Types.STG_DETAILS,
					datas: {
						name: item.indicname,//点击的策略名
						type: '专家',
						SecurityID: item.code,
						indic_type:this.indic_pool.type,//当前策略列表的过滤条件
						page_from:''
					}
				})
			})
		
		}
	},
	created(){
		this.initList();
	}
}
