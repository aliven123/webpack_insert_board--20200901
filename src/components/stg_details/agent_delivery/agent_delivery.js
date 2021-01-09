const init_str='--';
let order_confirm_url=`https://nujin.com/orderConfirm/`;
if(location.href.includes('localhost')){order_confirm_url='http://127.0.0.1:8848'};
export default {
	name: 'aupool_agent_delivery',
	data: function() {
		return {
			IsPC:this.basefn.IsPC,
			select_datas: {
				head_txt: '代理转发',
				styleobj: { /*如果传递了bottom,初始位置就以bottome为准，否则初始位置就居中*/
					'minWidth': '340px',
					'height': '500px',
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
			thead: {
				id:'序号',
				orderid: '订单号',
				indicname: '策略',
				code: '证券代码',
				consignee: '收货人',
				time:'购买周期',
				pay_state:'支付状态',
				need_state: '是否发货',
				address: '地址',
				phone: '电话',
				state: '发货状态'
			},
			edit_info: {
				//所有对象中，没有html这个键的，默认都是input
				// type默认都是text,有type的，以type为准
				id:{
					value: '1',
					disabled: true
				},
				orderid: {
					value: '',
					disabled: true
				},
				indicname: {
					value: '',
					disabled: true
				},
				code: {
					value: '',
					disabled: true,
				},
				consignee: {
					value: '',
					disabled: false,
				},
				time:{
					value: '',
					disabled: false,
					type:'number',
					min:0
				},
				need_state: {
					value: '',
					type: 'radio'
				},
				address: {
					value: '',
					disabled: false,
					html: 'textarea'
				},
				phone: {
					value: '',
					disabled: false,
				}
			},
			order_list:[],//点击支付时，checkbox选中的orderid
			delivery_obj:{
				//代理转发的显示的表数据
				def:-1,
				datas: [] 
			},
			status:init_str,
			action_menus: {
				def: false,//默认未选中增加/修改/删除
				list: {
					add: {
						action: 'handleAdd',
						txt: '增加'
					},
					modify: {
						action: 'handleModify',
						txt: '修改'
					},
					del: {
						action: 'handleDel',
						txt: '删除'
					}
				}
			},
			searchDatas:{
			  // 搜索框的所有股票等数据
				ipt_str:'',
				list_arr:[],
			  // 下拉框的样式
			  placeholder:'策略名',
			  ipt_style:{
				  height:'20px',
				  paddingLeft:'5px',
				  background:'white',
				  border:'1px solid black',
				  color:'black'
			  },
			  ul_style:{
			    background:'gray',
			    color:'black',
			    display: 'block',
			    width:'100%',
			    maxHeight:'120px',
			    textAlign:'left'
			  }
			},
			codeDatas: {
				// 搜索框的所有股票等数据
				ipt_str: '',
				list_arr: [],
				// 下拉框的样式
				placeholder: '名称 / 代码 / 首字母',
				ipt_style: {
					height:'20px',
					paddingLeft:'5px',
					background:'white',
					border:'1px solid black',
					color:'black'
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
	watch: {
		'edit_info.need_state.value': {
			immediate: true,
			handler(newval, oldval) {
				this.handleDisabled(newval);
			}
		}
	},
	methods: {
		initCodePools() {
			// search_pools
			/*给input的下拉列表请求缓存数据*/
			let list = sessionStorage.searchlist;
			console.log(list==='undefined');
			if (list != undefined && list!='undefined') {
				this.codeDatas.list_arr = JSON.parse(list);
			} else {
				const src = '/get_code_list/';
				this.basefn.ajaxfn(`${this.url_obj.lai_url}${src}`, "POST", "json", {
					c_board: 'all'
				}, (res) => {
					console.log(res);
					if(res && res.data.length>0){
					  this.codeDatas.list_arr=res.data;
					  sessionStorage.searchlist = JSON.stringify(res.data);
					}
				});
			};
		},
		getCodeTxt(self, data) {
			//获得搜索结果，切换证券代码，重新刷新数据
			console.log(data.split(' '));
			console.log(data);
			if (data.split(' ').length > 0) {
				this.setCodeStr(data.split(' ')[0]);
				this.edit_info.code.value=data.split(' ')[0];
			}
		},
		getIptTxt(self,val){
			console.log(val);
			// this.searchDatas.ipt_str=val;
			this.setIptStr(val);
			this.edit_info.indicname.value=val;
			
		},
		current_txt(self,val){
			console.log(val);
			this.edit_info.indicname.value=val.input_txt;
		},
		current_code(self,val){
			console.log(val);
			this.edit_info.code.value=val.input_txt;
		},
		initSearchPools() {
		  console.log(sessionStorage.indicatorlist);
		  /*给input的下拉列表请求缓存数据*/
		  let list = sessionStorage.indicatorlist;
		  if (list==='undefined' || list === undefined) {
		    const src = '/account/search/';
		    this.basefn.ajaxfn(`${this.url_obj.lai_url}${src}`, "GET", "json", {}, (res) => {
		      console.log(res);
			  if(res && res.length>0){
				  this.searchDatas.list_arr=res;
				  sessionStorage.indicatorlist = JSON.stringify(res.data);
			  }
		    });
		  }else{
			  this.searchDatas.list_arr = JSON.parse(list);
		  };
		},
		selectAll(){
			const order_list=[];
			if(this.order_list.length===0){
				this.delivery_obj.datas.forEach(item=>{
					order_list.push(item.orderid)
				});
			}
			this.order_list=order_list;
		},
		handleDisabled(need_state) {
			const reset_arr = ['address', 'phone', 'consignee']
			if (need_state === '不需要') {
				for (const key of reset_arr) {
					Object.assign(this.edit_info[key], {
						disabled: true,
					});
				}
			} else {
				for (const key of reset_arr) {
					Object.assign(this.edit_info[key], {
						disabled: false,
					});
				}
			}
		},
		close(hishow = false) { //reload:是否重新刷新页面的标记
			this.$emit('handleAgent', {
				hishow
			});
		},
		getSecurityID(code) {
			if (code.trim().includes(' ')) {
				code = code.split(' ')[0];
			};
			return code
		},
		editStg(item) {
			console.log(item);
			this.delivery_obj.def=item.orderid;
			// this.order_list=[item.orderid];
			this.status=init_str;
			const filter_result=this.order_list.filter((current,index)=>{
				if(current===item.orderid){
					this.order_list.splice(index,1)
				}
				return current===item.orderid
			});
			if(filter_result.length===0){
				this.order_list.push(item.orderid)
			};
			let obj = {};
			const key_arr = Object.keys(item).filter(name => {
				console.log(name);
				// orderid和state是不需要编辑的黑名单，剔除编辑状态
				return ['state','pay_state'].includes(name) === false;
			});
			for (const key of key_arr) {
				console.log(item[key])
				obj[key] = {
					value: item[key]
				}
				if (['id'].includes(key)) {
					obj[key].disabled = true;
				}
				if (key === 'need_state') {
					obj[key].type = 'radio'
				};
				if (key === 'time') {
					obj[key].type = 'number';
					obj[key].min = 0
				};
				if (key === 'address') {
					obj[key].html = 'textarea'
				}
			};
			console.log(obj);
			this.edit_info = obj;
			console.log(this.edit_info);
			// 切换行，需要查看发货状态，切换对应disabled的数据
			this.handleDisabled(obj.need_state.value);
			this.setIptStr(item.indicname);
			this.setCodeStr(item.code);
		},
		triggerHttp(method, data) {
			const src = `/order/taobao/`;
			return new Promise((resolve) => {
				this.basefn.ajaxfn(`${this.url_obj.lai_url}${src}`, method, 'json', data, (res) => {
					console.log(res);
					resolve(res);
				})
			})
		},
		async init_data() {
			// get代理转发的列表数据
			const data = this.gatherDatas();
			if (data.username === false) {
				if (location.href.includes('localhost')) {
					data.username = 'lcs11';
				} else {
					alert('请登录后再试！')
				}
			};
			const result = await this.triggerHttp('GET', data);
			if (result && Object.prototype.toString.call(result).includes('Array')) {
				const thead = Object.keys(this.thead);
				const arr = [];
				for (let item of result) {
					let obj = {};
					for (let key of thead) {
						// console.log(key);
						Object.assign(obj, {
							[key]: item[key]
						})
					}
					arr.push(obj);
				}
				this.delivery_obj={
					def:-1,
					datas:arr.reverse()
				}
				console.log(this.datas, thead);
			} else {
				this.status = []
			}
		},
		currentMenu(name) {
			// 点击增加/修改，切换菜单
			this.status=init_str;
			this.action_menus.def = name;
			if (name === 'add') {
				this.addReset();
			}
		},
		setIptStr(ipt_str){
			this.searchDatas.ipt_str=ipt_str;
		},
		setCodeStr(ipt_str){
			this.codeDatas.ipt_str=ipt_str;
		},
		addReset() {
			// 点击增加菜单，重置edit_info
			for (const [key] of Object.entries(this.edit_info)) {
				if (key === 'id') {
					continue;
				};
				this.edit_info[key].value = '';
				if (this.edit_info[key].disabled !== undefined) {
					this.edit_info[key].disabled = false;
				}
			};
			this.edit_info.need_state.value = '需要';
			this.setIptStr('');

		},
		filterOrders(){
			// 过滤未支付的代理转发订单列表
			console.log(this.delivery_obj.datas);
			console.log(this.order_list);
			const order_list=this.order_list.slice(0);
			return order_list.filter((current_val)=>{
				let result=false;
				for(const item of this.delivery_obj.datas){
					if(current_val===item.orderid && item.pay_state==='未支付'){
						result=true;
					}
				};
				return result
			})
		},
		AgentDeliveryOrder(){
			// 一键代发触发的函数
			this.status=init_str;
			if(this.order_list.length===0){
				this.status='请选择要支付的策略！'
				return;
			}else{
				let list=this.filterOrders();
				console.log(list);
				if(list.length===0){
					this.status='选中策略已支付！'
					return;
				}
			// 测试确认订单单页面
				list=list.join("_");
				const username=this.basefn.localUsername();
				// 传递过去的from_ur中有&符号，防止确认页面在拿到url，以&分割键值对时，错误分组，导致错误
				let from_url=location.href.replace(/&/g,'[a_t_r]');
				// let from_url='https://nujin.com/forum.php?mod=forumdisplay&fid=225&a=b'.replace(/&/g,'[a_t_r]');
				from_url=from_url.replace(/=/g,'[e_t_r]');
				const src=`${order_confirm_url}?orderids=${list}&username=${username}&from_url=${from_url}`;
				window.open(src,'_self');
			// 测试确认订单单页面
			};
			
			
			/* this.$parent.$emit('closeModel',{
				agent_delivery:{hishow:false},
				weixin:{
					hishow:false
				}
			}) */
		},
		HandleDelivery() {
			this.status=init_str;
			const {
				def,
				list
			} = this.action_menus;
			if(def===false){
				this.status='请点击:新增/修改/删除等指令';
				return;
			}else{
				this.status=init_str;
			};
			const action = list[def].action;
			this[action]();
		},
		gatherDatas(type) {
			// 收集代理转发的数据，并对收件人部分信息做验证；
			let data = {
				username: this.basefn.getUsername()
			};
			for (const [key, item] of Object.entries(this.edit_info)) {
				data[key] = item.value
			};
			if(type){
				data.type=type;
			};
			console.log(data);
			return data;
		},
		inspectValue(data){
			// 增加和修改时，输入框的检测函数
			const def=this.action_menus.def;
			this.status=init_str;
			const black_list={
				add:['orderid','username'],
				modify:['orderid','username']
			};
			let check_result=true;
			if(data.need_state==='不需要'){
				//不发货时不用检测的数据
				black_list[def].push('address','phone','consignee')
			};
			for(let [key,val] of Object.entries(data)){
				if(black_list[def].includes(key)){
					continue;
				};
				if(key==='phone' && !(/^1[3|4|5|6|7|8][0-9]\d{7,12}$/.test(val))){
					check_result=false;
					this.status=`${this.thead[key]}输入不合法`
					break;
				}else if(val===''){
					check_result=false;
					this.status=`${this.thead[key]}输入不合法`
					break;
				}
			}
			return check_result
		},
		async handleModify() {
			// 修改
			const data = this.gatherDatas('change');
			if (data.username === false) {
				if (location.href.includes('localhost')) {
					data.username = 'lcs11';
				}else{
					alert('请登录后再试！')
					return
				};
			};
			if(!this.inspectValue(data)){return};
			const {
				result,
				reason,
				error
			} = await this.triggerHttp('POST', data);
			console.log(result);
			const action_txt=this.action_menus.list[this.action_menus.def].txt;
			this.status = `${action_txt}:${reason}`;
			if(result==='ok'){
				this.init_data();
			};
		},
		async handleAdd() {
			// 增加
			const data = this.gatherDatas();
			if (data.username === false) {
				if (location.href.includes('localhost')) {
					data.username = 'lcs11';
				}else{
					alert('请登录后再试！')
					return
				};
			};
			if(!this.inspectValue(data)){return};
			const {
				result,
				reason,
				error
			} = await this.triggerHttp('POST', data);
			const action_txt=this.action_menus.list[this.action_menus.def].txt;
			this.status = `${action_txt}:${reason}`;
			if(result==='ok'){
				this.init_data();
			};
		},
		async handleDel() {
			// 增加
			const data = this.gatherDatas('del');
			if (data.username === false) {
				if (location.href.includes('localhost')) {
					data.username = 'lcs11';
				}else{
					alert('请登录后再试！')
					return
				};
			};
			const {
				result,
				reason,
				error
			} = await this.triggerHttp('POST', data);
			const action_txt=this.action_menus.list[this.action_menus.def].txt;
			this.status = `${action_txt}:${reason}`;
			if(result==='ok'){
				this.init_data();
			};
		}
		
	},
	components: {
		place_order: () => import("components/pop_over/pop_over.vue"),
		input_search:()=>import("components/input_search/input_search.vue")
	},
	created() {
		this.init_data();
		this.currentMenu('add')
	},
}
