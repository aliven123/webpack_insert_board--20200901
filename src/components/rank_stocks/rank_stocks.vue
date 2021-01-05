<template>
	<div id="rank_stocks">
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
				  <span v-text="item.txt"></span>
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
				  <span v-if="key=='img'" :class="{'indicator_img':key=='img'}">
					<img :src="'https://data.nujin.com'+item[key]" v-if="item[key]!=undefined" />
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
<script src="./rank_stocks.js"></script>
<style lang="less" src="./rank_stocks.less" scoped></style>
