import $ from 'jquery';
export default{
	name:'input_search',
	data:function(){
		return {
			active_index:-1,
			input_txt:'',/*input中的值*/
			target_arr:[],/*搜索结果*/
			ul_datas:null,/*ul的样式和数据源*/
			ul_hishow:false,
			debounce:null//防抖的定时器名字
		}
	},
	props:{
		init_obj:{
			type:Object,
			default:function(){
				return {
					list_arr:[
					'sr809a',
					'sr810b',
					'sr811c',
					'sr810d',
					'中国',
					'sr810f',
					'sr811g',
					'sr810h'
					],
					/*下拉列表的样式*/
					ul_style:{
						background:'gray',
				        display: 'block',
				        width:'115%',
				        maxHeight:'120px',
				        textAlign:'left'
					}
				}
				
			}
		},
		ipt_txt:{
			type:String,
			default:''
		}
	},
	watch:{
		ipt_txt:{//展示input中当前的证券内容
			deep:true,
			immediate:true,
			handler(newval,oldval){
				console.log(newval,oldval);
				if(newval!=oldval){
					this.input_txt=newval
				}
			}
		}
	},
	methods:{
		liDisplay(str){
			// 过滤切换到股票的fid,让其不显示
			if(str.includes('股吧')){
				const arr=str.split(' ');
				return `${arr[0]} ${arr[1]} ${arr[2]}`;
			}else{
				return str
			}
			
		},
		clearIpt(){	
			// this.input_txt='';
			this.$emit('uptateUllist');
		},
		searchResult(e,content=undefined){/*输入内容的时候，更新ul中li的数据*/
			console.log(content);
			clearTimeout(this.debounce);
			this.debounce=setTimeout(()=>{
				// 函数防抖的写法
				this.target_arr=[];
				this.ul_hishow=false;
				let ipt_txt=this.input_txt.toUpperCase();
				if(content!=undefined){
					ipt_txt=content.toUpperCase();
				};
				if(ipt_txt!=''){
					this.ul_datas.list_arr.forEach((item)=>{
						if(item.includes(ipt_txt)){
							this.target_arr.push(item);
						}
					});
					if(this.target_arr.length>0){
						this.active_index=0;
						this.ul_hishow=true;
					}
				};
				this.throwIpt();
			},200)
			
		},
		updateIndex(operate){/*切换index的大小*/
			let max=this.target_arr.length-1;
			let index=this.active_index;
			if(operate=='decrease'){
				index--;
				index=index<0?0:index;
			}else{
				index++;
				index=index>max?max:index;
			};
			const root_el=this.$el;
			const ul=$(root_el).find('ul').eq(0);
			const ul_height=ul.outerHeight();
			const current_li=ul.children('li').eq(index);
			const scroll_dis=current_li.offset().top-ul.offset().top-ul_height+ul.scrollTop();
			console.log(scroll_dis);
			if(scroll_dis>0){
				ul.scrollTop(ul_height+scroll_dis);	
			}else{
				ul.scrollTop(ul.scrollTop()+scroll_dis);	
			};
			this.active_index=index;
		},
		getTarget(i){
			if(i=='enter'){
				if(this.target_arr[this.active_index]){
					this.input_txt=this.target_arr[this.active_index];
				};
			}else{
				this.input_txt=this.target_arr[i];
			};
			this.target_arr=[];
			this.ul_hishow=false;
			this.throwResult();
		},
		updataUlDatas(e){/*第一次加载li的所有数据和ul的样式*/
			console.log(this.init_obj);
			this.ul_datas=this.init_obj;
		},
		throwResult(target){
			/* 选择了下来列表数据,抛出选择的数据 */
			if(target){/*金池选股结果，点击传递过来的选中行*/
				this.$emit('targetSecurity',{
					aupool_select:target
				});
//			console.log(this.input_txt);
				this.input_txt='';
			}else{
				this.$emit('targetSecurity',this.input_txt);
				// this.input_txt='';
			}
		},
		throwIpt(search_now=false){
			/* 没有选择列表数据的时候抛出当前输入的数据 */
			/* search_now为true说明是enter键触发,立即触发搜索 */
			
			this.$emit('current_txt',{
				search_now,
				input_txt:this.input_txt
			});
		},
		hideList(){
			/*鼠标离开下拉列表，下拉列表隐藏*/
			// this.input_txt='';
			// this.target_arr=[];
			this.ul_hishow=false;
		}
	},
	created(){
		this.updataUlDatas();
	},
	mounted(){
		$('body').on('click',()=>{
			this.hideList();
		})
	}
}