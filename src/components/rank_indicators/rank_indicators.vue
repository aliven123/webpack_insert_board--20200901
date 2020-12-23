<template>
	<div id="rank_indicators">
		<div class="wx_ctn boxs" v-if="wx_pay.hishow">
		  <div class="headers">
		    <span>微信支付</span>
		    <span
		      class="iconfont iconguanbi close_icon"
		      @click="actionWeixin(null,{hishow:false})"
		    >
		    </span>
		  </div>
		  <div class="mainctn boxs">
		    <div id="qrcode"></div>
		    <p v-text="wx_pay.status"></p>
		  </div>
		</div>
		<template v-if="positive_datas.code!==null">
			<positive_negative 
				ref="positive_negative"
				@actionWeixin="actionWeixin('self',$event)"
				:positive_datas="positive_datas"
			/>
		</template>
		<div class="indicator_title boxs">
			<div v-for="(item,index) in indic_pool.list"
				:class="['indicator',{'active':item==indic_pool.type}]"
				v-text="item"
				@click="toggleType(item)"
			>
			</div>
			<div class="more">
				<span class="gengduo">更多</span>
				<span class="boxs iconfont iconxiala"></span>
			</div>
		</div>
		<div class="t_head">
		  <table>
			<thead>
			  <tr>
				<th v-for="(item,name) in indicators.head">
				  <span v-if="item.txt==='综合排序'">
					  盈利率
				  </span>
				  <span v-else v-text="item.txt"></span>
				</th>
			  </tr>
			</thead>
		  </table>
		</div>
		<div class="t_body">
		  <table>
			<tbody>
			  <tr v-for="(item,index) in indicators.tbody"
				:key="index"
				:class="item.type!=undefined?item.type:''"
				  v-show="index<indicators.show_item"
				@click="toggleComponent('toggleComponent',item)"
			  >
				<td v-for="(key,i) in indicators.head_arr" :key="i">
				  <span v-if="key=='indicname'">
					  {{item[key]}}<i class="rank_des">购买</i>
				  </span>
				  <span v-else-if="key=='img'" :class="{'indicator_img':key=='img'}">
					<img :src="'https://data.aupool.cn'+item[key]" v-if="item[key]!=undefined" />
				  </span>
				  <span v-text="item[key]" v-else></span>
				</td>
			  </tr>
			</tbody>
		  </table>
		<div class="boxs more_indicators" @click="showAllIndicators">
			<span 
				v-if="indicators.show_item!==indicators.tbody.length"
				class="iconfont iconxiala"
			>
				展开策略
			</span>
			<span v-else
				class="iconfont iconshangla1"
			>
				隐藏策略
			</span>
		</div>
		</div>
	</div>
</template>
<script src="./rank_indicators.js"></script>
<style lang="less" src="./rank_indicators.less" scoped></style>
