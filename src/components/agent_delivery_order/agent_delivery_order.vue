<template>
	<place_order :select_obj="select_datas" onselectstart="return false">
		<span slot='close' class="iconfont iconguanbi" @click="close">
		</span>
		<div class="mainctn">
			<ul class="name">
				<li class="clearfix">
					<span class="fl">总价:</span>
					<span v-if="order_obj!==null" class="fr">
						{{order_obj.total_fee}}元
					</span>
				</li>
			</ul>
			<ul class="place_order boxs">
				<li class="order_type_ctn boxs">
					<input class="order_btn"
						type="button"
						value="立即购买"
						@click="getPaymentUrl"
					/>
					<div>
						<span v-for="(item,index) in pay_type.list" :class="[item.cls,{'active':index==pay_type.def}]" @click="handlePayType(index)">
						</span>
					</div>

				</li>
				<li v-text="status"></li>
			</ul>
		</div>
	</place_order>
</template>
<script src="./agent_delivery_order.js"></script>
<style lang="less" scoped src='./agent_delivery_order.less'></style>
