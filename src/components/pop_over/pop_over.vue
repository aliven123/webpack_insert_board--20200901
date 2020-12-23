<template>
	<div class="select_board clearfix boxs" :style="select_datas.styleobj">
		<ul class="header clearfix boxs"
			@mousedown="mouse_down" @click="maxIndex">
			<li class="fl">
				<span v-text="select_datas.head_txt" style="background:none"></span>
			</li>
			<li class="fr btnarr">
				<slot name="min"></slot>
				<slot name='max'></slot>
				<slot name='close'></slot>
			</li>
      <li class="add_section_relative">
        <slot name='add_section'></slot>
      </li>
		</ul>
		<div class="mainsec boxs" :style=select_datas.styleobj.mainsec_padding>
			<slot>主要内容</slot>
		</div>
	</div>
</template>
<script src="./pop_over.js"></script>
<style lang="less" src="./pop_over.less" scoped></style>
