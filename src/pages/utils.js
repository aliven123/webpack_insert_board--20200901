import QRCode from 'qrcodejs2';
const showWeixinPayment = function(code_url,colorDark='black',colorLight='white') {
	// const $el_width = $(this.$el).width();
	const $el_width = 320;
	const size = $el_width - 110;
	const el_qrcode = this.$el.querySelector("#qrcode");
	$(el_qrcode).html('');
	const qrcode = new QRCode(el_qrcode, {
		text:code_url, // 二维码地址
		// width: 340,
		// height: 270,
		width: size,
		height: size,
		colorDark,
		colorLight
	});
};
const getPaymentResult =function(out_trade_no,callBack) {
	console.log(out_trade_no);
	// clearTimeout(this.$el.timer);
	let src = `/wx_investment_callback/`;
	const time_period = '2500';
	let data = {
		out_trade_no
	};
	return new Promise((resolve)=>{
		this.basefn.ajaxfn(`${this.url_obj.lai_url}${src}`, 'POST', 'json', data, (res) => {
			const {
				error,
				result,
				url
			} = res;
			console.log(res);
			if (result == 'success') {
				// clearTimeout(this.$el.timer);
				/* setTimeout(() => {
					callBack && callBack.call(this);
				}, time_period); */
				resolve({
					payment:true
				});
			} else {
				if (error == '订单尚未支付') {
					/* this.$el.timer = setTimeout(() => {
						getPaymentResult.call(this,out_trade_no,callBack)
					}, 1000); */
					/* this.$el.timer = setTimeout(() => {
						getPaymentResult.call(this,out_trade_no)
					}, 1000); */
					resolve({
						payment:false
					});
				} else if (error == '该订单已成交') {
					/* clearTimeout(this.$el.timer);
					setTimeout(() => {
						window.location.href = url;
					}, time_period); */
					resolve({
						payment:true
					});
				};
			}
		});
	})
};
const sleep=function(interval){
	// 睡眠函数
	return new Promise(resolve=>{
		setTimeout(resolve,interval);
	})
};
export {showWeixinPayment,getPaymentResult,sleep}
