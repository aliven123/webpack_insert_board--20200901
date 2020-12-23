import {mapState} from 'vuex'
export default {
	name: 'select_board',
	data: function() {
		return {
			select_datas: null,
			el_size: {
				width: '',
				height: ''
			}
		}
	},
	props: {
		select_obj: {
			type: Object,
			default: function() {
				return {
					head_txt: '组合选股',
					styleobj: { /*如果传递了bottom,初始位置就以bottome为准，否则初始位置就居中*/
						'minWidth': '750px',
						'height': '500px',
						'bottom': '0px',
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
				}
			}
		}
	},
	methods: {
		windowSize(tag) {
			let el = $(this.$el);
			let window_w = null,
				window_h = null;
			const $_element=$(this.location_el.element);
			let resetCtn = function() { /*放大或缩小重新定义尺寸和位置函数*/
				//				this.$el.tag=tag;
				el.css({
					width: window_w,
					height: window_h
				});
			};
			console.log(this.select_datas.styleobj.multiple);

			let multiple = this.select_datas.styleobj.multiple,
				scale_x, scale_y;
			if (multiple == undefined) {
				scale_x = 0.8;
				scale_y = 0.8;
			} else {
				scale_x = multiple.scale_x;
				scale_y = multiple.scale_y;
			};
			//				multiple=multiple!=undefined?multiple:0.8;
			if (tag == 'minisize') {
				const now_height = $(el).height();
				/*点击最小化的时候，如果当前组件高度大于header的50（header高度为30px），
				 则重置当前组件的高度为header的高度，位置定位到最左和最右；

				 如果当前已经是最小状态，则重置为初始位置；
				 * */
				if (now_height > 50) {
					window_w = this.el_size.width;
					window_h = 30;
					resetCtn.call(this);
					this.init_position('original_position', {
						styleobj: {
							left: '0px',
							bottom: '0px'
						}
					});
				} else {
					console.log(4665);
					window_w = this.el_size.width;
					window_h = this.el_size.height;
					resetCtn.call(this);
					this.init_position('original_position');
				}

			} else if (tag == 'maxsize') {
				/*如果当前尺寸和原始尺寸相差小于3，则说明是原始状态，点击最大化，则放大尺寸
				 否则恢复到原始尺寸；
				 * */
				const now_width = $(el).width() - this.el_size.width;
				if (now_width < 3) {
					window_w = $_element.width() * scale_x;
					window_h = $_element.height() * scale_y;
					resetCtn.call(this);
					this.init_position();
				} else {
					window_w = this.el_size.width;
					window_h = this.el_size.height;
					resetCtn.call(this);
					this.init_position('original_position');
				}
			};
			this.$emit('finishRise');
		},
		mouse_down(event) {
			let el = $(this.$el);
			const $_element=$(this.location_el.element);
			class Common_set {
				constructor(...arg) {
					this.width = arg[0].clientX - el.position().left;
					this.height = arg[0].clientY - el.position().top;
					// console.log(this.width,this.height);
					
					this.max_left = $_element.width() - el.outerWidth(true);
					this.max_top = $_element.height() - el.outerHeight(true);
					this.$_element_top=$_element.offset().top;
					// console.log(this.max_top);
					
				}
				mouse_move() {
					$('body').bind('mousemove', (e) => {
						let left = e.clientX - this.width;
						let top = e.clientY - this.height-this.$_element_top;
						// console.log($_element.offset().top - $(window).scrollTop());
						if (left < 0) {
							left = 0;
						} else if (left > this.max_left) {
							left = this.max_left;
						};
						if (top < 0) {
							top = 0;
						} else if (top > this.max_top) {
							top = this.max_top;
						};
						el.css({
							'left': left,
							'top': top
						})
					});
					$('body').on('mouseup', function() {
						$('body').unbind('mousemove');
					})
				}
			};
			let common_set = new Common_set(event);
			common_set.mouse_move();
		},
		init_position(tag = 'location', styledata = this.select_datas) { /*默认是定位盒子在屏幕的中心位置*/
			let el = this.$el;
			const $_element=$(this.location_el.element);
			let el_w = $(el).outerWidth(true);
			let el_h = $(el).outerHeight(true);
			let window_w = $_element.width();
			let window_h = $_element.height();
			console.log(window_h);
			console.log(el_h);
			let {
				styleobj
			} = styledata;
			/*console.log((window_w-el_w)/2);
			console.log((window_h-el_h)/2);*/
			$(el).css({
				left: (window_w - el_w) / 2 + 'px',
				top: (window_h - el_h) / 2 + 'px'
			});
			/*如果init_position函数执行的标记是不是location,且传递过来有bottom数据，
			 * 则模块的位置以传递过来的位置为准*/
			if (tag != 'location' && styleobj.bottom != undefined) {
				console.log(styleobj.bottom);
				$(el).css({
					top: styleobj.top ? styleobj.top : '',
					left: styleobj.left ? styleobj.left : '',
					right: styleobj.right ? styleobj.right : '',
					bottom: styleobj.bottom
				});
			};
			console.log(464646);
		},
		init_size() { /*记录组件最开始的尺寸*/
			let el_w = $(this.$el).outerWidth(true),
				el_h = $(this.$el).outerHeight(true);
			this.el_size.width = el_w;
			this.el_size.height = el_h;
		},
		maxIndex() {
			import('./utils.js').then(res => {
				res.maxZindex.call(this)
				const zIndex = res.maxZindex.call(this);
				$(this.$el).css({
					'z-index': zIndex
				});
			});

		}
	},
	computed:{
		...mapState(['location_el'])
	},
	watch: {
		select_obj: {
			deep: true,
			immediate: true,
			handler: function(newval, oldval) {
				this.select_datas = newval;
				console.log(this.select_datas);
				this.$store.state.max_index_board = newval.head_txt;
				this.$nextTick(function() { /*传递数据更新之后，组件就需要重新计算位置*/
					this.init_position('original_position');
				})

			}
		}
	},
	mounted() {
		console.log(this.location_el);
		this.init_size();
		this.maxIndex();
		this.init_position();
	}
}
