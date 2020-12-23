<template>
	<span class="input_search" @keydown.stop>
		<input type="text" v-model.trim="ul_datas.ipt_str"
			:style="ul_datas.ipt_style"
			:disabled="ul_datas.ipt_style!=undefined?ul_datas.ipt_style.disabled:false"
			@input='searchResult($event)'
			@keydown.down="updateIndex('increase')"
			@keydown.up="updateIndex('decrease')"
			@keydown.enter="getTarget('enter')"
			@focus="clearIpt"
			:placeholder="ul_datas.placeholder"
		/>
		<ul :style='ul_datas.ul_style' 
			v-show="ul_hishow">
			<li v-for="(item,index) in target_arr"
			v-text="liDisplay(item)"
			:class="{'active':index==active_index}"
			@click="getTarget(index)">
			</li>
		</ul>
	</span>
</template>
<script src="./input_search.js"></script>
<style lang="less" src="./input_search.less" scoped></style>