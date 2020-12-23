import Echarts from 'echarts'
import {
	chart_option
} from './kline_option';
export default {
	name: 'profit_line',
	/*策略明细*/
	data: function() {
		return {
			option_data: null
		}
	},
	props: {
		charts_data: {
			type: Object,
			default: function() {
				return {
					/* title:'收益曲线测试',
					dates:['2013/1/24','2013/2/24','2013/3/24','2013/4/24','2013/5/24'],
					profit:[{
						name:'收益曲线',
						data:[45,23,575,21,3]
					}] */
				}
			}
		}
	},
	watch: {
		charts_data: {
			deep: true,
			handler(newval) {
				// console.log(newval);
				this.option_data = newval;
				this.drawChart();
			}
		}
	},
	methods: {
		drawChart() {
			this.option_data = this.charts_data;
			this.$nextTick(() => {
				const chart_boart = this.$el;
				const mychart = Echarts.init(chart_boart);
				this.mychart=mychart;
				mychart.clear();
				if (!this.option_data) return;
				const echart_option = chart_option(this.option_data);
				mychart.setOption(echart_option);
			})
		}
	},
	mounted() {
		this.option_data = this.charts_data;
		this.drawChart();
		window.addEventListener('resize',()=>{
			this.mychart.resize();
		})
	}
}
