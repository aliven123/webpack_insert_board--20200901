const default_datas = {
	// color: ['#2ba7ee', '#d53a35', '#ffae00', '#fe11f6', '#57993d', 'red'],
	color:['#57993d','#2ba7ee','#ff2d2d','#ffae00','#fe11f6','red']
};
const GRAY='#626262';
import Pub from '../../assets/common.js';
export const chart_option = ({
	title = '收益曲线',
	dates,
	profit,
	name,
	type
}) => {
	/* console.log(title);
	console.log(dates);
	console.log(profit);
	console.log(name);
	console.log(type); */

	const option_obj = {
		title: { //标题
			text: title,
			left: 'center',
			top: '0',
			textStyle: {
				color: GRAY
			},
			/* subtext: name != undefined ? name + type : '',
			subtextStyle: {
				color: '#e46a5e'
			}, */
			textAlign: 'auto'
		},
		legend: {
			orient: 'horizontal',
			left: '50px',
			top: '18px',
			textStyle: {
				color: '#e46a5e'
			},
			data: []
		},
		tooltip: { //提示框
			// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
			trigger: 'axis', //触发类型：坐标轴触发
			alwaysShowContent: false,
			show: true,
			axisPointer: { //坐标轴指示器配置项
				type: 'cross' //指示器类型，十字准星
			},
			borderColor: GRAY,
			borderWidth: 1,
			extraCssText: 'box-shadow: 0 0 9px rgba(0, 0, 0, 0.5);',
			//日k指标的data是一个对象，要单独处理
			formatter: function(param) {
				// console.log(param[0].axisValue)
				// let res = `${param[0].axisValue}<hr style=\'opacity:0.5;width:100%;\'/> `;
				let res = `
				<span style=\'color:${GRAY};\'>
					${param[0].axisValue}
				</span>
				<hr style=\'opacity:0.5;width:100%;\'/> `;
				param.forEach((item, index) => {
					if (index < 5) {
						res += `<span style=\'color:${item.color}\'>
							${item.seriesName}:${item.value}
						</span><br/> `
					}

				})
				return res;
			},
			backgroundColor: 'rgba(250,250,250,0.7)'
		},
		toolbox: {
			show: true,
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				dataView: {
					readOnly: false
				},
				magicType: {
					type: ['line', 'bar']
				},
				restore: {},
				saveAsImage: {}
			},
			emphasis: {
				iconStyle: {
					color: 'black',
					borderColor: '#000',
					borderWidth: 0,
					borderType: 'solid',
					opacity: 0.6

				}
			}
		},
		grid: {
			show: true,
			x: 45,
			y: 25,
			x2: 0,
			y2: 60,
			borderWidth: '0',
			containLabel: false /*grid 区域是否包含坐标轴的刻度标签*/
			// backgroundColor:'#ccc'
		},
		xAxis: [{
			show: true,
			/*多图，就要定义多个x轴，只显示一个，show定义隐藏*/
			type: 'category', //坐标轴类型，类目轴
			data: dates,
			//scale: true, //只在数字轴中有效
			boundaryGap: false, //刻度作为分割线，标签和数据点会在两个刻度上
			splitLine: {
				show: false
			}, //是否显示坐标轴轴线
			//splitNumber: 20, //坐标轴的分割段数，预估值，在类目轴中无效
			min: 'dataMin', //特殊值，数轴上的最小值作为最小刻度
			max: 'dataMax', //特殊值，数轴上的最大值作为最大刻度
			axisLine: {
				onZero: false,
				lineStyle: {
					color: '#d53a35'
				}
			}
		}],
		yAxis: [{
			scale: true, //坐标刻度不强制包含零刻度
			splitArea: {
				show: false //显示分割区域
			},
			position: 'left',
			gridIndex: '0',
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dotted',
					opacity: 0.3
				}
			},
			axisLine: {
				lineStyle: {
					color: '#d53a35'
				}
			},
			axisLabel: {
				formatter: function(value) {
					return Pub.yAxisFormatter(value)
				}
			}
		}],
		toolbox:{
			feature:{
				//控制是否出现数据视图
				// dataView: {
				// 	show: true,
				// 	readOnly: false
				// },
				//还原按钮配置项
				restore: { show: true },
				//保存为图片配置项
				saveAsImage: { show: true },
				dataZoom:{
					show:true
				}
			}
		},
		dataZoom: //用于区域缩放
		{
			type: 'slider',
			show: true,
			xAxisIndex: [0],
			height: '16px',
			start: 0,
			end: 100,
			dataBackground: {
				lineStyle: {
					color: 'red',
					opacity: 0.9
				},
				areaStyle: {
					color: 'red',
					opacity: 0.3
				}
			}
		},
		series: [ //图表类型
			{
				name: '收益率',
				type: 'line', //K线图
				data: profit, //y轴对应的数据
				/*symbol:'none',鼠标滑过线上对应的圆点*/
				smooth: true,
				/*线的平滑程度*/
				symbol: "none",
				itemStyle: {
					color: default_datas.color[0]
				},
				lineStyle: {
					width: 1
				}
			}
		],
		graphic: [{
			type: 'group',
			rotation: Math.PI / 7,
			bounding: 'raw',
			right: 40,
			bottom: 20,
			z: 100,
			children: [{
					type: 'rect',
					left: 'center',
					top: 'center',
					z: 100,
					cursor: 'auto',
					shape: {
						width: 170,
						height: 30
					},
					style: {
						fill: 'rgba(0,0,0,0.3)'
					}
				},
				{
					type: 'text',
					left: 'center',
					top: 'center',
					z: 100,
					cursor: 'auto',
					style: {
						fill: '#e46a5e',
						text: 'nujin.com',
						font: 'bolder 14px Microsoft YaHei'
					}
				}
			]
		}]
	};
	const legend_data = [];
	const series = []
	// for(const [i,item] of Array.entries(profit)){
	for (var i = 0; i < profit.length; i++) {
		// legend中data内的字符串必须和series里面的name保持一致，否则不渲染；
		legend_data.push(profit[i].name);
		series.push({
			name: profit[i].name,
			type: 'line', //K线图
			data: profit[i].data, //y轴对应的数据
			/*symbol:'none',鼠标滑过线上对应的圆点*/
			smooth: true,
			/*线的平滑程度*/
			symbol: "none",
			itemStyle: {
				color: default_datas.color[i]
			},
			lineStyle: {
				width: 1
			}
		})
	};
	option_obj.legend.data = legend_data;
	option_obj.series = series;
	return option_obj;
}
