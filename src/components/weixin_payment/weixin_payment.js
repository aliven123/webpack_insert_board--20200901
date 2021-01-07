import weixin_board from 'components/pop_over/pop_over.vue';
import QRCode from 'qrcodejs2';
console.log(123132);
export default {
  name: 'weixin_payment',
  /*策略下单*/
  data: function() {
    return {
      shuo_url: null,
      select_datas: {
        head_txt: '微信购买',
        styleobj: { /*如果传递了bottom,初始位置就以bottome为准，否则初始位置就居中*/
          'minWidth': '260px',
          'height': '290px',
          'background': '#ffffff',
          /*背景颜色*/
          'multiple': {
            scale_x: 0.8,
            scale_y: 0.8
          },
          /*最大化宽高是屏幕的倍数*/
          'mainsec_padding': {
            'padding': '50px 20px 10px 20px'
          }
        }
      },
      weixin_obj: null,
      status: '微信扫码付款'
      /*onoff:truegetPaymentResult递归是否执行的开关*/
    }
  },
  props: {
    datas: {
      type: Object
    }
  },
  components: {
    weixin_board
  },
  methods: {
    close() {
      this.$emit('actionWeixin', {
        hishow: false
      })
    },
	showWeixinPayment() {
	  //			const wx_obj=document.querySelector('.mainctn');
	  const {code_url:wx_url,out_trade_no} = this.weixin_obj;
	  // const wx_url = '';
	  console.log(this.weixin_obj);
	  if(out_trade_no=='wx_gzh'){
		  // 关注二维码
		  this.$nextTick(() => {
			  $('#qrcode').css({
				  'height':'195px',
				  'width': '200px'
			  });
			  this.status='扫一扫，关注微信公众号'
			  this.select_datas.head_txt='关注公众号'
		  })
	  }else{
		  this.$nextTick(() => {
			const qrcode_ctn=this.$el.querySelector("#qrcode");
			$(qrcode_ctn).empty();
			const datas ={
			  text: wx_url, // 二维码地址
			  width: 260,
			  height: 195,
			  colorDark: "#000",
			  colorLight: "#fff"
			};
			new QRCode(qrcode_ctn, datas);
		  })
	  }
	  
	},
	downDownUserInfo(username,password){
		let data = {
		  username,password
		},src=`weixin_pay/download_userinfo/?username=${username}&password=${password}`;
		const a_link = document.createElement('a');
		a_link.href = `${this.shuo_url}/${src}`;
		a_link.download = '努金用户信息';
		document.body.appendChild(a_link);
		a_link.click();
		document.body.removeChild(a_link);
		
	},
    getPaymentResult() {
      //			const username=this.$store.state.userobj.txt;
	  if(this.$el){
		 clearTimeout(this.$el.wxPaymentResult); 
	  };
      const {
        out_trade_no,
        wx_cb_src
      } = this.weixin_obj;
      let src = `/weixin_pay/callback/`;
      // 查看支付结果的回调
      if (wx_cb_src != undefined) {
        src = wx_cb_src
      };
      const time_period = '2500';
      let data = {
        out_trade_no
      };
      this.basefn.ajaxfn(`${this.shuo_url}${src}`, 'POST', 'json', data, (res) => {
        console.log(res);
        const {
          error,
          result,
		  username,password,
          url
        } = res;
		console.log(result,result == 'success')
        if (result == 'success') {
          this.status = `
			支付成功!您已订阅了交易信号，请关注公众号！
		  `;
		  setTimeout(()=>{
			  this.close();
		  },1500);
		  if( username && password){
			  this.downDownUserInfo(username,password);
		  }
        } else {
          if (error == '订单尚未支付') {
            this.$el.wxPaymentResult = setTimeout(() => {
              this.getPaymentResult()
            }, 1000);
          } else if (error == '该订单已成交') {
            this.status = `
				支付成功!您已订阅了跟单信号，请关注公众号！
            `;
          };
        };
      })
    }
  },
  watch: {
    datas: {
      deep: true,
      immediate: true,
      handler(newval, oldval) {
        this.shuo_url = this.url_obj.lai_url;
        console.log(newval,oldval);
        this.weixin_obj = newval;
        this.showWeixinPayment();
		if(newval.out_trade_no!=='wx_gzh'){
			this.getPaymentResult();
		}
      }
    }
  },
  computed: {
    statusColor() {
      const status = this.status;
      const style_obj = {
        color: 'black',
        fontWeight: 'normal'
      };
      if (status == '支付成功') {
        style_obj.color = '#7bd25f';
        style_obj.fontWeight = 'bolder';
      }
      return style_obj;
    }
  },
  created() {
	this.shuo_url = this.url_obj.shuo_url;
    console.log(this.shuo_url);
  },
  beforeDestroy() {
    clearTimeout(this.$el.wxPaymentResult);
  }
}
