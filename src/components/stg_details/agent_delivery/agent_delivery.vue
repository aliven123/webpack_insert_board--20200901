<template>
	<place_order :select_obj="select_datas" onselectstart="return false">
		<span slot='close' class="iconfont iconguanbi" @click="close(false)">
		</span>
		<div class="mainctn">
			<div class="dl_table_ctn boxs">
				<div class="thead">
					<table>
						<tbody>
							<tr>
								<td v-if="name!=='orderid'"
								v-for="(val,name) in thead"
								:key="name">
									<template v-if="name==='id'&&IsPC">
										{{val}}
										<span class="stg_all"
											@click="selectAll"
										>全选</span>
									</template>
									<template v-else>
										{{val}}
									</template>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class='tbody'>
					<table>
						<tbody>
							<tr v-for="(item,index) in delivery_obj.datas"
							 :key="item.orderid"
							 :class="{active:delivery_obj.def===item.orderid}"
							 @click="editStg(item)"
							 >
								<td v-for="(val,name) in thead"
									 v-if="name!=='orderid'"
									 :key="name"
								>
								<span v-if="name==='id'">
									<input type="checkbox"
									:value="item.orderid"
									v-model="order_list"
									>
								</span>
								<span v-text="item[name]"></span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="order_ctn boxs">
				<div class="action_ctn clearfix">
					<input class="order_btn fl"
					 type="button" value="增加"
					  :class="{active:action_menus.def===name}"
					 v-for="(val,name) in action_menus.list"
					  :value="val.txt"
					  @click="currentMenu(name)"
					   />
					   <input class="order_confirm fr"
					   type="button" value="支付" 
					   @click="AgentDeliveryOrder" />
					<input class="order_confirm fr" 
					type="button" value="确定" 
					@click="HandleDelivery" />
				</div>
				<p v-text="status" class="action_result"></p>
				<ul class="edit_info">
					<li class="boxs" v-for="(item,name) in edit_info"
						v-if="name!=='orderid'"
						:key="name"
					>
					  <p class="des boxs">
					  	{{thead[name]}}:
					  </p>
					  <p class="val boxs">
						  <!-- <input_search v-if="name==='indicname'" /> -->
						  <template v-if="item.html===undefined&&item.type===undefined"">
							  <!-- 普通的input输入框 -->
							  <input_search 
								v-if="name==='indicname'"
								  :init_obj="searchDatas" 
								  :ipt_txt="searchDatas.ipt_str" 
								  @uptateUllist="initSearchPools"
								  @current_txt="current_txt('self',$event)"
								  @targetSecurity="getIptTxt('self',$event)"
							 />
							 <input_search
								v-else-if="name==='code'"
							 	:init_obj="codeDatas"
							 	:ipt_txt="codeDatas.ipt_str"
							 	@uptateUllist="initCodePools"
								@current_txt="current_code('self',$event)"
							 	@targetSecurity="getCodeTxt('self',$event)"
							 />
							  <input
								 v-else
								 type="text"
								 :disabled="item.disabled"
								 class="boxs" v-model.trim="item.value"
							  />
						  </template>
						  <template v-else-if="item.html==='textarea'">
							  <!-- textarea -->
							  <textarea rows="3"
							    :disabled="item.disabled"
								class="textarea boxs" v-model.trim="item.value"
							  >
							  </textarea>
						  </template>
						  <template v-else-if="item.html===undefined&&item.type==='number'">
							  <input
								 type="number"
								 :min="item.min"
								 :disabled="item.disabled"
								 class="boxs" v-model.trim="item.value"
							  />
							  <span>月</span>
						  </template>
						  <template v-else-if="item.html===undefined&&item.type==='radio'">
							  <!-- radio -->
							  <label>
								  <input type="radio" value="需要" v-model="item.value" />发货
							  </label>
							  <label>
								<input type="radio" value="不需要" v-model="item.value" />不发货
							  </label>
						  </template>
					  </p>
					</li>
				</ul>
			</div>
		</div>
	</place_order>
</template>

<script src="./agent_delivery.js"></script>
<style src="./agent_delivery.less" scoped lang="less"></style>
