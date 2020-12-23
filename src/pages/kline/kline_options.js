const upColor = '#d53a35';
const upBorderColor = '#d53a35';
const downColor = '#57993d';
const downBorderColor = '#57993d';
const chartoption=function() {
	const options = {
		/* title: { //标题
			text: this.SecurityID,
			left: '2%',
			top: '1%',
			textStyle: {
				color: 'black'
			}
		}, */
		tooltip: { //提示框
			// 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
			trigger: 'axis', //触发类型：坐标轴触发
			position: ['8%', '8%'],
			axisPointer: { //坐标轴指示器配置项
				type: 'cross' //指示器类型，十字准星
			},
			// 日k指标的data是一个对象，要单独处理
			formatter: function(param) {
				var res = ``;
				let filternum = function(num) {
					// 过滤日K和MACDto/oltip的值，如果为’-‘，则返回空，否则数字化，保留两位小数
					if (num == '-') {
						return ''
					} else {
						return Number(num).toFixed(2);
					}
				};
				let tiptxt = function(list_obj, status = false) {
					let filter_txt = list_obj.value;
					let txt = null;
					if (!status) {
						filter_txt = filternum(list_obj.value);
					} else {
						filter_txt = filter_txt[1]
					};
					txt =
						`<span style=\'color:${list_obj.color}\'>
                    ${list_obj.seriesName} : ${filter_txt}
                    </span>`
					return txt
				}
				let param_len = param.length;
				let split_index = 4; //主图的几个指标是固定的，主图需要显示的指标的个数
				let value = 0;
				if (param[0].axisIndex == 0) {
					for (var i = 0; i < param_len; i++) {
						if (i < split_index) {
							if (i == 0) {
								res += tiptxt(param[i], true)
							} else {
								res += tiptxt(param[i])
							}
						} else if (i == split_index) {
							res += tiptxt(param[i]) + `<br/>`
						} else {
							res += tiptxt(param[i])
						}
					}
				} else {
					split_index = param_len - split_index;
					for (var i = 0; i < param_len; i++) {
						if (i < split_index - 2) {
							res += tiptxt(param[i])
						} else if (i == split_index - 2) {
							res += tiptxt(param[i]) + `<br/>`
						} else {
							if (i == split_index - 1) {
								res += tiptxt(param[i], true)
							} else {
								res += tiptxt(param[i])
							}

						}
					}
				}
				return res;
			},
			backgroundColor: 'rgba(50,50,50,0)'
		},
		legend: { //图例控件，点击图例控制哪些系列不显示
			data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30'],
			top: '1%',
			textStyle: {
				color: 'black'
			}
		},
		axisPointer: {
			link: {
				xAxisIndex: 'all'
			}
		},
		grid:[{
				show: true,
				left: '40px',
				right: '40px',
				height: '50%',
				borderWidth: 0,
				containLabel: false /*grid 区域是否包含坐标轴的刻度标签*/
				//				  backgroundColor:'#ccc'
			}, {
				show: true,
				left: '40px',
				right: '40px',
				height: '25%',
				top: 'bottom',
				borderWidth: 0,
				containLabel: false
				//				  backgroundColor:'#ccc'
			}],
		xAxis: [{
			show: true,
			/*多图，就要定义多个x轴，只显示一个，show定义隐藏*/
			type: 'category', //坐标轴类型，类目轴
			data: this.data0.categoryData,
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
		}, {
			show: false,
			type: 'category', //坐标轴类型，类目轴
			gridIndex: '1',
			/*该对象配置grid中第几个图*/
			data: this.data0.categoryData,
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
			},
			axisPointer: {
				label: {
					color: 'rgba(0,0,0,0)',
					backgroundColor: 'rgba(0,0,0,0)'
				}
			}
		}],
		yAxis: [{
			scale: true, //坐标刻度不强制包含零刻度
			splitArea: {
				show: false //显示分割区域
			},
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
				formatter: (value) => {
					return this.basefn.yAxisFormatter(value)
				}
			}
		}, {
			scale: true, //坐标刻度不强制包含零刻度
			gridIndex: '1',
			/*该对象配置grid中第几个图*/
			splitNumber: 3,
			/*坐标轴的分割段数*/
			splitArea: {
				show: false //显示分割区域
			},
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
				show: true,
				/*是否显示刻度标签*/
				showMinLabel: false,
				/*是否显示最小刻度*/
				formatter: function(value, index) {
					/*刻度显示格式，如果数据过大，则除以10000，后面带万*/
					if (value > 10000) {
						value = value / 10000 + '万'
					}
					return value
				}
			}
		}],
		dataZoom: [ //用于区域缩放
			{
				type: 'inside',
				xAxisIndex: [0, 1],
				start: this.dynamicZoomStart(),
				end: 100
			},
			{
				show: true,
				/*隐藏了缩放滚动条，但是功能还在*/
				xAxisIndex: [0, 1],
				type: 'slider',
				bottom: '30%',
				height: '15px',
				start: this.dynamicZoomStart(),
				end: 100
			}
		],
		series: [ //图表类型
			{
				name: '日K',
				type: 'candlestick', //K线图
				data: this.data0.values, //y轴对应的数据
				barMaxWidth: 20,
				itemStyle: {
					normal: {
						color: upColor,
						color0: downColor,
						borderColor: upBorderColor,
						borderColor0: downBorderColor
					}
				},
				////////////////////////图标标注/////////////////////////////
				markPoint: { //图表标注
					label: { //标注的文本
						normal: { //默认不显示标注
							show: true,
							formatter: function(param) { //标签内容控制器
								return param != null ? Math.round(param.value) : '';
							}
						}
					},
					data: [ //标注的数据数组
						{
							name: 'XX标点',
							coord: ['2013/5/31', 2300], //指定数据的坐标位置
							value: 2300,
							itemStyle: { //图形样式
								normal: {
									color: 'rgb(41,60,85)'
								}
							}
						},
						{
							name: 'highest value',
							type: 'max', //最大值
							valueDim: 'highest' //在highest维度上的最大值 最高价
						},
						{
							name: 'lowest value',
							type: 'min',
							valueDim: 'lowest' //最低价
						},
						{
							name: 'average value on close',
							type: 'average',
							valueDim: 'close' //收盘价
						}
					],
					tooltip: { //提示框
						formatter: function(param) {
							return param.name + '<br>' + (param.data.coord || '');
						}
					}
				},
				/////////////////////////////////图标标线///////////////////////////
				markLine: {
					symbol: ['none', 'none'], //标线两端的标记类型
					data: [
						[{
								name: 'from lowest to highest',
								type: 'min', //设置该标线为最小值的线
								valueDim: 'lowest', //指定在哪个维度上的最小值
								symbol: 'circle',
								symbolSize: 10, //起点标记的大小
								label: { //normal默认，emphasis高亮
									normal: {
										show: false
									}, //不显示标签
									emphasis: {
										show: false
									} //不显示标签
								}
							},
							{
								type: 'max',
								valueDim: 'highest',
								symbol: 'circle',
								symbolSize: 10,
								label: {
									normal: {
										show: false
									},
									emphasis: {
										show: false
									}
								}
							}
						],

						{
							name: 'min line on close',
							type: 'min',
							valueDim: 'close'
						},
						{
							name: 'max line on close',
							type: 'max',
							valueDim: 'close'
						}
					]

				}

			},
			{ //MA5 5天内的收盘价之和/5
				name: 'MA5',
				type: 'line',
				data: this.calculateMA(5),
				symbol: "none",
				smooth: true,
				itemStyle: {
					normal: {
						color: "#8f9192",
						lineStyle: {
							color: "#8f9192"
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				}
			},
			{
				name: 'MA10',
				type: 'line',
				data: this.calculateMA(10),
				symbol: "none",
				smooth: true,
				itemStyle: {
					normal: {
						color: "#ffae00",
						lineStyle: {
							color: "#ffae00"
						}
					}
				},
				lineStyle: { //标线的样式
					normal: {
						opacity: 0.7
					}

				}
			},
			{
				name: 'MA20',
				type: 'line',
				data: this.calculateMA(20),
				symbol: "none",
				smooth: true,
				itemStyle: {
					normal: {
						color: "#fe11f6",
						lineStyle: {
							color: "#fe11f6"
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				}
			},
			{
				name: 'MA30',
				type: 'line',
				data: this.calculateMA(30),
				symbol: "none",
				smooth: true,
				itemStyle: {
					normal: {
						color: "#2ba7ee",
						lineStyle: {
							color: "#2ba7ee"
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				}
			}, { /*指标绘图的数据开始*/
				name: this.markarr[0].name,
				type: this.markarr[0].data_style,
				barMaxWidth: this.markarr[0] != undefined ? this.barwidth(this.markarr[0]) : '',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: this.markarr[0].data,
				itemStyle: {
					normal: {
						color: this.markarr[0].color,
						lineStyle: {
							color: this.markarr[0].color
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				},
				symbol: "none",
				/*标记的图形*/
				smooth: true /*线条是否平滑*/
			}, {
				name: this.markarr[1] != undefined ? this.markarr[1].name : '',
				type: this.markarr[1] != undefined ? this.markarr[1].data_style : 'line',
				barMaxWidth: this.markarr[1] != undefined ? this.barwidth(this.markarr[1]) : '',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: this.markarr[1] != undefined ? this.markarr[1].data : '',
				itemStyle: {
					normal: {
						color: this.markarr[1] != undefined ? this.markarr[1].color : '',
						lineStyle: {
							color: this.markarr[1] != undefined ? this.markarr[1].color : ''
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				},
				symbol: "none",
				/*标记的图形*/
				smooth: true /*线条是否平滑*/
			}, {
				name: this.markarr[2] != undefined ? this.markarr[2].name : '',
				type: this.markarr[2] != undefined ? this.markarr[2].data_style : 'line',
				barMaxWidth: this.markarr[2] != undefined ? this.barwidth(this.markarr[2]) : '',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: this.markarr[2] != undefined ? this.markarr[2].data : '',
				itemStyle: {
					normal: {
						color: this.markarr[2] != undefined ? this.markarr[2].color : '',
						lineStyle: {
							color: this.markarr[2] != undefined ? this.markarr[2].color : ''
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				},
				symbol: "none",
				/*标记的图形*/
				smooth: true /*线条是否平滑*/
			}, {
				name: this.markarr[3] != undefined ? this.markarr[3].name : '',
				type: this.markarr[3] != undefined ? this.markarr[3].data_style : 'line',
				barMaxWidth: this.markarr[3] != undefined ? this.barwidth(this.markarr[3]) : '',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: this.markarr[3] != undefined ? this.markarr[3].data : '',
				itemStyle: {
					normal: {
						color: this.markarr[3] != undefined ? this.markarr[3].color : '',
						lineStyle: {
							color: this.markarr[3] != undefined ? this.markarr[3].color : ''
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				},
				symbol: "none",
				/*标记的图形*/
				smooth: true /*线条是否平滑*/
			}, {
				name: this.markarr[4] != undefined ? this.markarr[4].name : '',
				type: this.markarr[4] != undefined ? this.markarr[4].data_style : 'line',
				barMaxWidth: this.markarr[4] != undefined ? this.barwidth(this.markarr[4]) : '',
				xAxisIndex: 1,
				yAxisIndex: 1,
				data: this.markarr[4] != undefined ? this.markarr[4].data : '',
				itemStyle: {
					normal: {
						color: this.markarr[4] != undefined ? this.markarr[4].color : '',
						lineStyle: {
							color: this.markarr[4] != undefined ? this.markarr[4].color : ''
						}
					}
				},
				lineStyle: {
					normal: {
						opacity: 0.7
					}
				},
				symbol: "none",
				/*标记的图形*/
				smooth: true /*线条是否平滑*/
			}
		]
	};
	if (this.chartinfo.IOPV) {
		options.series.push({
			name: 'IOPV',
			type: 'line',
			xAxisIndex: 0,
			yAxisIndex: 0,
			data: this.chartinfo.IOPV.flat(),
			symbol: "none",
			smooth: true,
			itemStyle: {
				normal: {
					color: "yellow",
					lineStyle: {
						color: "yellow"
					}
				}
			},
			lineStyle: {
				normal: {
					opacity: 0.7
				}
			}
		});
	};
	return options;
}
const reset_str='--';
const kinds={
	'stock':'股票',
	'future':'期货',
	'arbitrage':'套利',
	'fund':'基金',
	'bond':'债券',
	'group':'篮子',
	'stock_index':'指数',
	reset_str
};
export {chartoption,kinds,reset_str};
