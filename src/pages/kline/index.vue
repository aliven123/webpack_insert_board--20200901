<template>
	<div id="aupool_kline" :style="home_height?'height:'+home_height+'px':''">
		<!-- 东方财富头部 -->
		<template v-if="c_component.current!=false">
			<component :is='c_component.current'></component>
		</template>
		<template v-else>
			<div class="hq_cr boxs">
				<!-- <div class="iconfont iconfanhui"></div> -->
				<ul>
					<li class="name">
						<span v-text="SecurityName"></span>
						<span v-text="SecurityID" class="code">--</span>
					</li>
					<li v-text="c_board_to_des" class="kind">--</li>
				</ul>
				<!-- <div>
					<template v-if="IsPC">
						<input_search :init_obj="searchDatas" :ipt_txt="searchDatas.ipt_str" @uptateUllist="initSearchPools"
						 @targetSecurity="getIptTxt('self',$event)" />
					</template>
					<template v-else>
						<span class="iconfont iconsousuo"></span>
					</template>
				</div> -->
			</div>
			<!-- 东方财富开换量额和最高最低 -->
			<ul class="data boxs">
				<li class="data_fl boxs">
					<table>
						<tbody>
							<tr>
								<td v-for="(item,index) in data_fl">
									<template v-for="(value,name) in item">
										<!-- 每个对象对象值一行 -->
										<p>
											<!-- 中文描述 -->
											<span class="des" v-if="value.txt!=undefined" v-text="value.txt"></span>
											<!-- 对应的vulue值 -->
											<template v-if="name=='zhangdie'">
												<span :class="['num',changeColor]" v-text="value.val[0]">
												</span>
												<span :class="['num',changeColor]" v-text="value.val[1]">
												</span>
											</template>
											<template v-else>
												<span :class="['num',{'large':value.cls=='large'},changeColor]" v-text="yAxisFormatter(value.val,2)[0]">
												</span>
											</template>
										</p>
									</template>
								</td>
							</tr>
						</tbody>
					</table>
					<!-- <div>自选</div> -->
				</li>
				<li class="data_fr boxs">
					<table>
						<tbody>
							<tr>
								<td v-for="(item,index) in data_fr.list">
									<p>
										<span class="des" v-text="item.des">--</span>
										<span :class="['num',toggleColor(item.val)]" v-text="item.val">--</span>
									</p>
								</td>
								<td class="action">
									<span class="iconfont iconxiala"></span>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
			</ul>
			<ul class="mkt_info boxs">
				<li class="chart_board">
					<!-- 周期列表 -->
					<div class="frequency">
						<div v-for="(value,key) in frequency.list" @click="toggleKlineNav('frequency',key)" v-text="value.des" :class="['boxs',{'active':key==frequency.def}]">
						</div>
						<div class="more">
							<span class="gengduo">更多</span>
							<span class="boxs iconfont iconxiala"></span>
						</div>
					</div>

					<!--K线图板块  -->
					<div id="chart_ctn">
						<div class="error_notice" v-text="error_notice">

						</div>
					</div>
					<!-- 指标列表 -->
					<div class="indicators">
						<div v-for="(value,key) in indicators.list" @click="toggleKlineNav('indicators',key)" v-text="value.des" :class="['boxs',{'active':key==indicators.def}]">
						</div>
						<div class="more">
							<span class="gengduo">更多</span>
							<span class="boxs iconfont iconxiala"></span>
						</div>
					</div>
				</li>
				<li class="five_market boxs">
					<div class="OffLevelValue boxs">
						<table>
							<tbody>
								<tr v-for="(item,index) in five_market.OffLevelValue" :class="toggleColor(item.price)">
									<td class="des" v-text="item.des"></td>
									<td v-text="item.price"></td>
									<td v-text="item.volume"></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="BidLevelValue boxs">
						<table>
							<tbody>
								<tr v-for="(item,index) in five_market.BidLevelValue" :class="toggleColor(item.price)">
									<td class="des" v-text="item.des"></td>
									<td v-text="item.price"></td>
									<td v-text="item.volume"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</li>
			</ul>
			<div v-if="board.def!=false" class="board_ctn boxs">
				<div class="tog_board boxs">
					<div v-for="(item,key) in board.nav_list"
					 v-text="item.des"
					  :class="['boxs fl nav_btn',{'active':key==board.def}]"
					 @click="handleBoard(key)">
					</div>
				</div>
				<!-- actionFn为board各组件内部触发的函数，触发当前组件（def）,对应的handlefn -->

				<keep-alive>
					<component :is="board.def" :init_obj="board.datas" @actionFn="actionFn(board.def,$event)">
					</component>
				</keep-alive>
			</div>
		</template>
	</div>
</template>
<script src="./index.js"></script>
<style lang="less" scoped src="./index.less"></style>
