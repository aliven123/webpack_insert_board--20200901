<template>
	<div>
		<weixin_board
			:select_obj="select_datas"
			onselectstart="return false">
			<span slot='close'
				class="iconfont iconguanbi" @click="close">
			</span>
			<div class="mainctn wx_payment">
				<div class="total_price_ctn">合计付款：{{weixin_obj.total_price}}元</div>
				<div id="qrcode" class="boxs">
					<img v-if="weixin_obj.code_url.includes('http')" class="wx_gzh" :src="weixin_obj.code_url" alt="">
				</div>
				<ul>
					<li v-html="status" :style="statusColor"></li>
				</ul>
			</div>
		</weixin_board>
	</div>
</template>
<script src='./weixin_payment.js'></script>
<style lang="less" scoped src="./weixin_payment.less"></style>