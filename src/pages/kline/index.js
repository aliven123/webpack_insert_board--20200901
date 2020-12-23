import Echarts from 'echarts'
import {chartoption,kinds,reset_str} from './kline_options.js';
import basefn from 'assets/common.js';
import { mapState } from 'vuex'
import * as Types from 'store/types';
// const CryptoJS=require('crypto-js');


const colorarr=['#2ba7ee','#8f9192','#ffae00','#fe11f6','red','#57993d'];//均线的颜色
const timeout=3000;
const TradePx='TradePx',PrevClosePx='PrevClosePx',
   ChangeAmount='ChangeAmount',ChangeRate='ChangeRate',
   OpenPx='OpenPx',TotalValueTraded='TotalValueTraded',
   TotalVolumeTraded='TotalVolumeTraded',
   HighPx='HighPx',LowPx='LowPx',Limitdown='Limitdown',Limitup='Limitup',
   BidLevels='BidLevels',OfferLevels='OfferLevels';
const s_indicname='s_indicname',s_indic_type='s_indic_type',s_SecurityID='s_SecurityID';

export default {
	name: 'kline',
	data: function() {
		return {
			that:null,
			IsPC: this.basefn.IsPC,
			SecurityID: reset_str,
			SecurityName: reset_str,
			c_board:reset_str,
			TradePx:reset_str,
			PrevClosePx:reset_str,
			data_fl: [{
				jia: {
					val: reset_str,
					cls: 'large'
				},
				zhangdie: {
					val: [reset_str, reset_str]
				}
			}, {
				kai: {
					txt: '开',
					val: reset_str
				},
				huan: {
					txt: '换',
					val: reset_str
				}
			}, {
				liang: {
					txt: '量',
					val: reset_str
				},
				e: {
					txt: '额',
					val: reset_str
				}
			}],
			data_fr: {
				list: [{
					des: '最高',
					val: reset_str
				}, {
					des: '最低',
					val: reset_str
				}, {
					des: '量比',
					val: reset_str
				}, {
					des: '市值',
					val: reset_str
				}]
			},
			five_market: {
				// 五档买价
				BidLevelValue: [{
					des: '买1',
					price: reset_str,
					volume: reset_str

				}, {
					des: '买2',
					price: reset_str,
					volume: reset_str

				}, {
					des: '买3',
					price: reset_str,
					volume: reset_str

				}, {
					des: '买4',
					price: reset_str,
					volume: reset_str

				}, {
					des: '买5',
					price: reset_str,
					volume: reset_str

				}],
				// 五档卖价
				OffLevelValue: [{
					des: '卖1',
					price: reset_str,
					volume: reset_str

				}, {
					des: '卖2',
					price: reset_str,
					volume: reset_str

				}, {
					des: '卖3',
					price: reset_str,
					volume: reset_str

				}, {
					des: '卖4',
					price: reset_str,
					volume: reset_str

				}, {
					des: '卖5',
					price: reset_str,
					volume: reset_str
				}]
			},
			frequency: {
				def: '1d',
				list: {
					/* fenshi: {
						des: '分时'
					}, */
					'1d': {
						des: '日k'
					},
					'1w': {
						des: '周k'
					},
					'1mon': {
						des: '月K'
					},
					'1q': {
						des: '季K'
					},
					'1y': {
						des: '年K'
					}
				}
			},
			indicators: {
				def: 'MACD',
				list: {
					MACD: {
						des: 'MACD'
					},
					KDJ: {
						des: 'KDJ'
					},
					RSI: {
						des: 'RSI'
					},
					DMA: {
						des: 'DMA'
					},
					WR: {
						des: 'WR'
					},
					CCI: {
						des: 'CCI'
					},
					DMI: {
						des: 'DMI'
					},
					PSY: {
						des: 'PSY'
					}
				}
			},
			board:{
				def:'clph',
				// def:false,
				datas:{
					code:null
				},
				nav_list:{
					clph:{
						des:'策略排行',
						handleFn:'emitClphFn'
					},
					/* yaowen:{
						des:'要闻'
					},
					bankuai:{
						des:'板块'
					},
					zijin:{
						des:'资金'
					},
					 F10:{
						des:'F10'
					}, */
					/* zhenduan:{
						des:'诊断'
					} */
				}
			},
			searchDatas:{
			  // 搜索框的所有股票等数据
				ipt_str:'',
				list_arr:[],
			  // 下拉框的样式
			  placeholder:'名称 / 代码 / 首字母',
			  ipt_style:{
				  height:'20px',
				  paddingLeft:'5px'
			  },
			  ul_style:{
			    background:'gray',
			    color:'white',
			    display: 'block',
			    width:'100%',
			    maxHeight:'120px',
			    textAlign:'left'
			  }
			},
			// 画k线的数据开始
			error_notice:'',
			url_data: null,
			operation: 'normal', //默认不复权

			data0: '', //处理好的数据
			chartinfo: '',
			markarr:[{
				name:'K',
				data:[],
				color:'',//图的颜色
				data_style:''//图的类型，bar还是line
			}],//指标的数据
			mychart:null,
			zoom:{
				start:null,
				end:null
			}
			// 画k线的数据结束
									
		}
	},
	components:{
		input_search:()=>import('components/input_search/input_search.vue'),
		clph:()=>import('components/rank_indicators/rank_indicators.vue'),
		[Types.STG_DETAILS]:()=>import('components/stg_details/stg_details.vue')
	},
	computed:{
		changeColor(){
			const TradePx=Number.parseFloat(this.TradePx);
			const PrevClosePx=Number.parseFloat(this.PrevClosePx);
			if(TradePx>PrevClosePx){
				return 'red_clr';
			};
			if(TradePx<PrevClosePx){
				return 'green_clr';
			};
			return ''
		},
		c_board_to_des(){
			// console.log(kinds,this.c_board);
			return kinds[this.c_board]
		},
		// 映射state中的全局数据
		...mapState(['c_component','home_height'])
	},
	watch:{
		'c_component.current':{
			// 由其它组件，切换返回当前页，
			//需要重新刷新绘图，因为生命周期函数是单例，不会重新执行
			handler(newval,oldval){
				if(newval===false){
					console.log(this.c_component,'返回index');
					// 1.从其它页面返回设置SecurityID
					// 2.设置传递到策略排行的数据
					this.SecurityID=this.c_component.datas.SecurityID;
					this.updateCodeInfo().then(data=>{
						this.board.datas={code:this.SecurityID};
						this.getChartInfo();
					});
				}
			}
		}
	},
	methods: {
		actionFn(def,datas){
			// 内部组件触发的函数，都经过这个函数触发，进行对应的分发
			console.log(def,datas);
			const handleFn=this.board.nav_list[def].handleFn;
			console.log(handleFn);
			this[handleFn](datas);
		},
		yAxisFormatter:basefn.yAxisFormatter,
		getIptTxt(self,data){
			//获得搜索结果，切换证券代码，重新刷新数据
			console.log(data.split(' '));
			if(data.split(' ').length>0){
				this.SecurityID=data.split(' ')[0];
				this.board.datas={code:this.SecurityID};
				for(let [key,val] of Object.entries(kinds)){
					if(data.includes(val)){
						this.c_board=key;
						break;
					}
				};
			}else{
				this.SecurityID==reset_str
				this.board.datas={code:reset_str};
			};
			this.searchDatas.ipt_str='';
			this.updateCodeInfo().then(data=>{
				console.log(data);
				this.getChartInfo();
			});
		},
		initSearchPools() {
		  // search_pools
		  /*给input的下拉列表请求缓存数据*/
		  let list = sessionStorage.searchlist;
		  if (list != undefined) {
		    this.searchDatas.list_arr = JSON.parse(list);
		  } else {
		    const src = '/get_code_list/';
		    this.basefn.ajaxfn(`${this.url_obj.lai_url}${src}`, "POST", "json", {
		      c_board:'all'
		    }, (res) => {
		      // console.log(res);
		      sessionStorage.searchlist = JSON.stringify(res.data);
		    });
		  };
		},
		toggleColor(val){
			const TradePx=Number.parseFloat(val);
			const PrevClosePx=Number.parseFloat(this.PrevClosePx);
			if(TradePx>PrevClosePx){
				return 'red_clr';
			};
			if(TradePx<PrevClosePx){
				return 'green_clr';
			};
			return ''
		},
		toggleKlineNav(target, key) {
			this[target].def = key;
			this.getChartInfo();
		},
		requestdatas() {
			const {
				day_period,
				min_period
			} = this.url_data;
			const urlport = this.frequency.def.endsWith('m') ? day_period : min_period;
			const username = '';
			let stockdata = new Promise((resolve, reject) => {
				this.basefn.ajaxfn(`${this.url_obj.lai_url}/${urlport}`, "POST", "json", {
					"start_time": this.count_time('start'),
					"end_time": this.count_time('end'),
					"code": this.SecurityID,
					"operation": this.operation,
					"frequency": this.frequency.def,
					username
				}, (res) => {
					/*更新数据画图*/
					// console.log(res);
					resolve(res);
				})
			})
			return stockdata;
		},
		requestmark() {
			const urlport = 'quan_language/translation';
			const username = '';
			/* let type = this.c_board;
			if (type == 'fund') {
				type = 'funds'
			};
			if (type == 'stock_index' || type == 'group') {
				type = 'index'
			}; */
			let markdata = new Promise((resolve, reject) => {
				this.basefn.ajaxfn(`${this.url_obj.lai_url}/${urlport}/`, "POST", "json", {
					"code": this.SecurityID, // 股票代码
					"datatype": this.operation, // 复权
					"frequency": this.frequency.def, // 周期
					"indicators": this.indicators.def, // 指标名
					username
				}, (res) => {
					//					console.log(JSON.parse(res));
					resolve(res)
				})
			});
			return markdata;
		},
		getChartInfo() {
			// if (!this.url_data) {
				const {
					'default': {
						getRequestUrl
					}
				} = require('./kline_data_config.js');
				this.url_data = getRequestUrl(this.c_board);
			// };
			console.log(this.c_board,this.url_data);
			if(this.c_board==reset_str){
				if(this.mychart){
					this.mychart.dispose();
				}
				const chart_ctn=$(this.$el).find('#chart_ctn');
				chart_ctn.html(`
					<div class="error_notice"
					style="
						position: absolute;
						left:50%;top:50%;
						transform:translate(-50%,-50%);
						text-align: center;
						color:#e46a5e;
						font-size: 30px"
					>
						服务器正常升级维护，请稍后访问！
					<div>
				`)
				return;
			};
			clearTimeout(window.refreshdata_info_time_sharing);
			Promise.all([this.requestdatas(), this.requestmark()]).then((results) => {
				/* console.log(results);
				console.log(results[0]);
				console.log(results[1]); */
				if(results[1].error){
					this.error_notice=results[1].error;
					this.mychart.clear();
					return;
				};
				// console.log(results);
				let datas = results[0].securityinfo;
				this.chartinfo = results[0];
				this.data0 = this.splitData(datas);
				// console.log(this.chartinfo, this.data0);
				let mark_info = results[1].data;
				this.markarr = [];
				mark_info.forEach((item, index) => {
					/*如果k线形态没有定义，就给图定义形态，否则就用用户定义的形态*/
					//					if(item.data_style==''){
					if (item.name == 'VOL') {
						item.data_style = 'bar'
						item.barwidth = '20'
					} else if (item.name == 'MACD') {
						item.data_style = 'bar'
						item.barwidth = '3'
					} else {
						item.data_style = 'line'
					}
					//					};
					/*如果用户没有定义颜色,就调用默认颜色*/
					if (item.color == '' || item.color == undefined) {
						item.color = colorarr[index];
					};
					this.markarr.push(item);
				});
				this.drawcharts()
			}).catch(reason => {
				console.log(reason);
			});
		},
		drawcharts(){
			// this.$nextTick(function(){
				let mychart=Echarts.init(document.getElementById('chart_ctn'));
				mychart.on('click',function(){
					console.log(1331);
				});
				this.mychart=mychart;
				/*切换option内部的数据源的时候，渲染的折现会包含上一次的数据源，
				 * 导致数据混乱了，绘图混乱，
				 * 必须用clear()方法，清空当前数据
				 * */
				mychart.clear();
				/*消除原有数据的数据的影响结束*/;
				// console.log(chartoption.call(this));
				mychart.setOption(chartoption.call(this));
				const zoom=mychart.getOption().dataZoom[0];
				console.log(zoom);
				this.zoom.start=zoom.start;
				this.zoom.end=zoom.end;
				// console.log(this.zoom);
				mychart.on('dataZoom',(event)=>{
					let start,end;
					if(event.batch){
			    		start=event.batch[0].start;
			    		end=event.batch[0].end;
			    	}else{
			    		start=event.start;
			    		end=event.end;
			    	};
			    	this.zoom.start=start;
					this.zoom.end=end;
					console.log(this.zoom);
				});
			// });
		},
		setDataFl(data){
			//更新首行开，昨，量，额的数据；
			const data_fl=[];
			this.TradePx=data[TradePx];
			this.PrevClosePx=data[PrevClosePx];
			data_fl.push({
				jia: {
					val: data[TradePx],
					cls: 'large'
				},
				zhangdie: {
					val: [data[ChangeAmount], `${data[ChangeRate]}%`]
				}
			},{
				[OpenPx]:{
					txt:'开',
					val:data[OpenPx]
				},
				[PrevClosePx]:{
					txt:'昨',
					val:data[PrevClosePx]
				}
			},{
				[TotalVolumeTraded]:{
					txt:'量',
					val:data[TotalVolumeTraded]
				},
				[TotalValueTraded]:{
					txt:'额',
					val:data[TotalValueTraded]
				}
			});
			this.data_fl=data_fl;
		},
		setDataFr(data){
			//更新最高，最低，涨停，跌停；
			const data_fr={
				list:[]
			};
			data_fr.list.push({
				des:'最高',
				val:data[HighPx]
			},{
				des:'最低',
				val:data[LowPx]
			},{
				des:'涨停',
				val:data[Limitup]?data[Limitup]:reset_str
			},{
				des:'跌停',
				val:data[Limitdown]?data[Limitdown]:reset_str
			});
			this.data_fr=data_fr;
			// console.log(this.data_fr);
		},
		setFiveMarket(data){
			const five_market={
				BidLevelValue:[],//五档买价
				OffLevelValue:[]
			};
			if(data[BidLevels]==undefined||data[BidLevels].length==0){
				this.five_market=five_market;
				return;
			};
			for(const [i,item] of data[BidLevels].entries()){
				five_market.BidLevelValue.push({
					des:`买${i+1}`,
					price:item.Price,
					volume:item.OrderQty
				})
			};
			for(const [i,item] of data[OfferLevels].entries()){
				five_market.OffLevelValue.push({
					des:`卖${i+1}`,
					price:item.Price,
					volume:item.OrderQty
				})
			};
			this.five_market=five_market;
		},
		updateCodeInfo(){
			clearTimeout(this.$el.updateCodeInfo);
			// console.log(this.c_component.datas.go_home);
			if(this.c_component.datas.go_home==='no'){
				return;
			};
			/* if(this.c_component.datas.page_from==='stg_details'){
				this.SecurityID
			} */
			return new Promise(resolve=>{
				const datas={
					code:this.SecurityID,
					search_tag: true
				}
				this.basefn.ajaxfn(`${this.url_obj.bin_url}/get_market_data/`,
				 "POST", "json",datas, (res) => {
					// 更新数据画图
					// console.log(res);
					let {data,result,c_board}=res;
					if(result=='success'){
						this.c_board=c_board;
						if(Object.prototype.toString.call(data.SecurityName).includes('Array')){
							this.SecurityName=data.SecurityName[0];
						}else{
							this.SecurityName=data.SecurityName;
						};
						
						this.setDataFl(data);
						this.setDataFr(data);
						this.setFiveMarket(data);
						
					}else{
						this.c_board=reset_str;
						data={
							[TradePx]:reset_str,
							[PrevClosePx]:reset_str,
						   [ChangeAmount]:reset_str,
						   [ChangeRate]:reset_str,
						   [OpenPx]:reset_str,
						   [TotalValueTraded]:reset_str,
						   [TotalVolumeTraded]:reset_str,
						   [HighPx]:reset_str,
						   [LowPx]:reset_str,
						   [Limitdown]:reset_str,
						   [Limitup]:reset_str,
						   [BidLevels]:[]
						}
						this.SecurityName=reset_str;
						this.setDataFl(data);
						this.setDataFr(data);
						this.setFiveMarket(data);
					};
					this.$el.updateCodeInfo=setTimeout(()=>{
						this.updateCodeInfo();
					},timeout)
					resolve(this.c_board);
				})
			}).catch((err)=>{
				console.log(err);
				this.updateCodeInfo();
			})
		},
		renderStgdetails(name,type='专家',SecurityID){
			const cpt_name='toggleComponent';
			console.log('renderStgdetails');
			this.$store.commit(Types[cpt_name],{
				// stg_details,必须和index.js引入的组件名保持一致
				current:Types.STG_DETAILS,
				datas:{
					name,
					type,
					SecurityID,
					go_home:'yes'//不需要返回首页的,则隐藏stg_details按钮，也不用启动行情刷新函数
				}
			})
		},
		splitData(rawData) {
			var categoryData = [];
			var values = [];
			for (var i = 0; i < rawData.length; i++) {
				//splice 返回每组数组中被删除的第一项，即返回数组中被删除的日期
				//alert(rawData[i].splice(0, 1)[0]);
				//categoryData 日期 把返回的日期放到categoryData[]数组中
				categoryData.push(rawData[i].splice(0, 1)[0]); /*包含删除项的新数组*/
				//alert(categoryData);

				//数据数组，即数组中除日期外的数据
				// alert(rawData[i]);
				values.push(rawData[i]) //原数组被修改了
			}
			return {
				categoryData: categoryData, //数组中的日期 x轴对应的日期
				values: values //数组中的数据 y轴对应的数据
			};
		},
		count_time(timetype) {
			function checktime(i) {
				if (i < 10) {
					i = '0' + i;
				};
				return i;
			};
			let t0 = Date.parse(new Date()) - 24 * 3600000;
			let dateobj = new Date(t0);
			let y = dateobj.getFullYear();
			let m = dateobj.getMonth() + 1;
			let prem = dateobj.getMonth() + 1;
			if (this.frequency.def.endsWith('m')) {
				prem = prem - 1;
				if (prem == 0) prem = 12;
				prem = checktime(prem);
			};
			m = checktime(m)
			let d = dateobj.getDate() + 0;
			d = checktime(d);
			let h = dateobj.getHours();
			let m_txt = dateobj.getMinutes();
			let s = dateobj.getSeconds();
			h = checktime(h);
			m_txt = checktime(m_txt);
			s = checktime(s);
			let endtime = `${y}-${m}-${d} ${h}:${m_txt}:${s}`;
			let startime = `${y-10}-${m}-${d} ${h}:${m_txt}:${s}`
			if (this.frequency.def.endsWith('m')) {
				endtime = `${y}-${m}-${d} 00:00:00`;
				startime = `${y}-${prem}-${d} 00:00:00`
			};
			if (timetype == 'start') {
				return startime
			} else {
				return endtime;
			}
		},
		dynamicZoomStart(displaynum=180){
			let num=displaynum/this.data0.values.length;
			if(num>=1){
				return 0;
			}else{
				num=1-Number(num.toFixed(2));
				return parseInt(num*100)
			}
		
		},
		calculateMA(dayCount) {
		  var result = [];
		  for (var i = 0, len = this.data0.values.length; i < len; i++) {
		  if (i < dayCount) {
		   result.push('-');
		   //alert(result);
		   continue; //结束单次循环，即不输出本次结果
		  }
		  var sum = 0;
		  for (var j = 0; j < dayCount; j++) {
		   //收盘价总和
		   sum += Number(this.data0.values[i - j][1]);
		   //alert(sum);
		  }
		  result.push(sum / dayCount);
		  // alert(result);
		  }
		  return result;
		},
		barwidth(targetobj){
			let width='';
			if(targetobj.barwidth!=undefined){
				width=targetobj.barwidth;
			};
			return width
		},		
		initData(){
			//根据路由传递的参数，获取证券代码，名称和分类
			// let str=window.location.search.substr(1);
			let str=$('#aupool_single_page_ctn').attr('search_info').substr(1);
			const getData=function(str,split_str){
				return str.split(split_str)
			};
			const param_arr=getData(str,'&')
			// console.log(param_arr,str);
			let key_val=null;
			let queryToObj=this.basefn.queryToObj();//console.log(s_code);
			let indic_name=queryToObj[s_indicname],
			SecurityID=queryToObj[s_SecurityID],s_code=queryToObj.s_code,type=queryToObj.type;
			if(type===undefined){type='专家'};
			if(s_code){
				window.s_code=s_code;
			};
			if(indic_name && type && SecurityID){
				// 搜索引擎：专家诊股/牛股排行，通过链接获取的数据，直接跳转到详情页
				indic_name=decodeURI(indic_name);
				SecurityID=decodeURI(SecurityID);
				type=decodeURI(type);
				this.renderStgdetails(indic_name,type,SecurityID);
				return;
			};
			// 通过查询字符串，获得证券代码，名称，和分类
			if(param_arr.length>0){
				if(str.includes('indicator')||location.search.includes('sort_id')){
					// 如果包含indicator,首页直接切换到stg_details
					let indicator=null,type=undefined,SecurityID=undefined;
					for(const item of param_arr){
						key_val=getData(item,'=');
						console.log(key_val);
						if(key_val[0]=='SecurityID'){
							SecurityID=key_val[1];
							continue;
						};
						if(key_val[0]=='indicator'){
							indicator=key_val[1];
							continue;
						};
					};
					console.log(indicator);
					this.renderStgdetails(indicator,type,SecurityID);
				}else{
					/* 如果不包含indicators,则显示行情界面 */
					for(const item of param_arr){
						// console.log(item);
						key_val=getData(item,'=');
						if(key_val[0]=='SecurityID'){
							this.SecurityID=key_val[1]
							// 传递rank_indicators,策略排行中的数据
							this.board.datas={code:key_val[1]};
						};
					}
				};
				
			}else{
				console.log('--------------');
				this.SecurityID=reset_str;
				this.SecurityName=reset_str;
				// 传递rank_indicators,策略排行中的数据
				this.board.datas={code:reset_str};
			};
		}
	},
	created(){
		// return;//策略解码
		this.that=this;
		this.initData();
		// console.log(this.c_component,'created中触发');
		// console.log(this.basefn.queryToObj());
	},
	mounted() {
		// return;//策略解码
		if(this.updateCodeInfo()){
			this.updateCodeInfo().then(data=>{
				this.getChartInfo();
			});
		};
		window.addEventListener('resize',()=>{
			this.mychart.resize();
		})
		console.log('测试')
	},
	beforeDestroy(){
		clearTimeout(this.$el.updateCodeInfo);
	}
}
