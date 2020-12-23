<template>
	<div id="stg_details" class=" boxs">
		<!-- 立即购买弹窗 -->
		<place_order v-if="orders.hishow"
			:order_list=orders.data
			@closeOrderBoard="placeOrder(false)"
			@actionWeixin="actionWeixin('self',$event)"
		>
		</place_order>
		<agent_delivery_order
			 v-if="agent_orders.hishow"
			 :order_list=agent_orders.data
			 @closeOrderBoard="AgentDeliveryOrder('agent_orders',{hishow:false})"
			 @actionWeixin="actionWeixin('agent_orders',$event)"
		 />
		<!-- 微信支付弹窗 -->
		<weixin_payment
			:datas="weixin"
			v-if="weixin.hishow"
			@closeCboard="closeCboard('self',$event)"
			@actionWeixin="actionWeixin('self',$event)"
		/>
		<!-- 一键代发弹窗 -->
		<agent_delivery
			v-if="agent_delivery.hishow"
			:agent_datas="agent_delivery.datas"
			@handleAgent="handleAgent($event)"
			@AgentDeliveryOrder="AgentDeliveryOrder('self',$event)"
		/>
		<div class="top_nav_ctn boxs">
			<div class="top_nav boxs">
				<div>
					<span
						v-if="c_component.datas.go_home!='no'"
						class="iconfont iconfanhui backhome" 
						@click="toggleComponent('toggleComponent')"
					>	
						返回
					</span>
					<span class="k_bold" v-text="c_component.datas.name"></span>
					<span class="k_bold" v-text="c_component.datas.type"></span>
				</div>
				<div>
					<input type="button" value="一键代发"
						@click="handleAgent"
					>
					<input type="button" 
						value="订阅盘前交易信号" 
						@click='placeOrder'
					>
				</div>
			</div>
			<div class="stg_status boxs" v-if="strategy.need_back_test===true">
				策略运行状态：等待运算结果
			</div>
		</div>
		<div class="stg_des">
			<table>
				<tbody>
					<tr>
						<td v-for="(item,index) in strategy.base_info"
						 class="fl boxs">
							<span class="txt des">
								{{item.txt}}:
							</span>
							<span class="val">
								{{item.val}}
							</span>
						</td>
					</tr>
					<tr>
						<td>
							<span class="txt des">
								{{strategy.des.txt}}:
							</span>
							<span class="val">
								{{strategy.des.val}}
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="indic_des boxs">
			<div class="echart_ctn">
				<profit_line
					class="profit_line boxs"
					:charts_data="chart_data.data"
					>
				</profit_line>
			</div>
			<div class="head">
				<div>
					<span class="toggle_security">
						切换标的 
					</span>
					<template>
						<input_search 				
							:init_obj="searchDatas"
							:ipt_txt="searchDatas.ipt_str"
							@uptateUllist="initSearchPools"
							@targetSecurity="getIptTxt('self',$event)"
						/>
					</template>
					<input
						type="button"
						value="切换行情"
						v-if="c_component.datas.go_home!='no'"
						class="to_hq_page"
						@click="toHqPage"
					>
				</div>
				<div class="more"
					@click="profitList"
				>
					<template v-if="strategy.toggle_value==='策略详情'">
						<span class="gengduo"
							v-text="strategy.toggle_value"></span>
						<span class="boxs iconfont iconxiala"></span>
					</template>
					<template v-else>
						<span class="gengduo"
							v-text="strategy.toggle_value"></span>
						<span class="boxs iconfont iconshangla1"></span>
					</template>
				</div>
			</div>
			<div class="main_ctn">
				<div 
					v-for="(item,index) in strategy.profit"
					v-if="index<strategy.show_num"
					:style="item.txt.includes('合约')?'width:100%':''"
					class="indic_item boxs"
				>
					<span class="txt des">
						{{item.txt}}:
					</span>
					<span class="val">
						{{item.val}}
					</span>
				</div>
			</div>
		</div>
		
		<div class="stg_info">
			<!-- <div v-if="strategy.locking===true"
				 @click="login"
				class="blur_cover"
			>
				<p class="boxs iconfont iconau_board_suo">
							  策略持仓，点击登录后查看!
				</p>
			</div> -->
			<div class="details_head boxs">
				<span>
					量化投资策略跟单
				</span>
				<div>
					<input type="button" value="复制推广链接"
						@click='promoStg'
					/>
					<input type="button" value="订阅盘前交易信号"
						@click='placeOrder'
					>
				</div>
			</div>
			<!-- 策略持仓模块 -->
			<div class="details_head_ctn boxs">
				<p>历史下单统计</p>
				<div class="deal_status boxs">
					<template>
					  <el-table
						:data="strategy.table_data.body"
						height="218"
						border
						style="width: 100%">
						<el-table-column
						  prop="order_d"
						  label="下单日期">
						</el-table-column>
						<!-- <el-table-column
						  prop="code"
						  label="证券代码"
						  width="180">
						</el-table-column>
						<el-table-column
						  prop="codename"
						  label="名称"
						  width="180">
						</el-table-column> -->
						<el-table-column
						  prop="way"
						  label="交易方向">
						</el-table-column>
						<el-table-column
						  prop="num"
						  label="成交量">
						</el-table-column>
						<el-table-column
						  prop="price"
						  label="成交价格(元)">
						</el-table-column>
						<el-table-column
						  prop="sell"
						  label="成交额(元)">
						</el-table-column>
						<el-table-column
						  prop="fee"
						  label="交易手续费(元)">
						</el-table-column>
						<!-- <el-table-column
						  prop="shizhi"
						  label="持仓市值(元)"> -->
						</el-table-column>
						<el-table-column
						  prop="avai"
						  label="可用资金(元)">
						</el-table-column>
						
					  </el-table>
					</template>
				</div>
			</div>
			<div class="hold_info_ctn boxs">
				<p>现有持仓</p>
				<div class="hold_info boxs">
					<template>
						  <el-table
							:data="strategy.hold_info.body"
							height="118"
							border
							style="width: 100%"
							>
								<el-table-column prop="code" label="证券代码">
								</el-table-column>
								<el-table-column prop="codename" label="名称">
								</el-table-column>
								<el-table-column prop="holdnum" label="持仓量">
								</el-table-column>
						</el-table>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
<script src="./stg_details.js"></script>
<style lang="less" src="./stg_details.less" scoped></style>
