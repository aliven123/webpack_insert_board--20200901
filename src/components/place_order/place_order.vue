<template>
	<place_order
		:select_obj="select_datas"
		onselectstart="return false">
		<span slot='close'
			class="iconfont iconguanbi" @click="close">
		</span>
		<div class="mainctn">
			<ul class="name">
				<li class="clearfix">
					<span class="fl">{{order_data.name.txt}}:{{order_data.name.val}}</span>
					<span class="fr">{{order_data.type.txt}}:{{order_data.type.val}}</span>
				</li>
				<li>
					<span>证券代码:{{order_data.name.code}}</span>
				</li>
			</ul>
			<ul class="place_order boxs">
				<li v-for="(item,name) in order_data"
					v-if="li_hishow(name)"
					class="order_data">
					
					<template v-if="name==='price'||name==='discount_price'">
						
							<span class="order_des" v-if="item.hishow===true">
								{{item.txt}}
							</span>
							<i class="order_val" v-if="item.hishow===true">
								{{item.val}}
							</i>
					</template>
					<template v-else>
						<p v-text="item.txt"></p>
						<p>
							<input type="number"
								v-model="item.val"
								min="1"
								:disabled="item.disabled" />
						</p>
					</template>
				</li>
				<li class="order_type_ctn boxs">
					<input class="order_btn"
						type="button"
						value="立即购买"
						@click="getPaymentUrl"
				 	/>
					<div>
						<span v-for="(item,index) in pay_type.list"
							:class="[item.cls,{'active':index==pay_type.def}]"
							@click="handlePayType(index)"
						>
						</span>
					</div>
				 	
				</li>
				<li v-text="status"></li>
			</ul>
		</div>
	</place_order>
</template>
<script src="./place_order.js"></script>
<style lang="less" scoped src='./place_order.less'></style>