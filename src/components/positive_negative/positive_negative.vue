<template>
    <div id="positive_negative" class="boxs">
	  <div v-if="username===false"
	   :class="['boxs',{blur_cover:username===false}]"
		@click="login">
		  <p class="boxs iconfont iconau_board_suo">
			  努金牛策诊股，请点击登录后再试！
		  </p>
	  </div>
      <div class="advice_head">
        <p>努金牛策诊股</p>
		<p class="advice_des"
			v-text="styleDatas.advice_data.advice_des+'['+styleDatas.advice_data.des+']'"
			:style="styleDatas.advice_data.styleobj"
		></p>
		<!-- <p class="advice_des" 
			v-text="styleDatas.advice_data.des"
			:style="styleDatas.advice_data.styleobj"
		></p> -->
		<p v-if="username===false"
		 :class="{blur_cover_tips:username===false}"
		>
			请登录后点击下方查看更多策略！
        </p>
		<p style="font-size: 14px;color:gray;margin:4px 0">{{warning}}</p>
      </div>
	  <div class="advice_title clearfix">
	  		<div class="fl buyStg" 
	  			v-if="btn_obj.active!==null&&order_data!==null"
	  		>
	  			<input type="button"
	  				value="购买"
	  				class="boxs"
	  			  @click="getPaymentUrl"
	  			/>
	  			<select v-model="order_data.def">
	  				<option 
	  					v-for="(item,index) in order_data.list"
	  					:value="index"
	  				>
	  					{{item.time}}
	  				</option>
	  			</select>
	  			<p class="fl">
	  				{{order_data.list[order_data.def].price}}
	  				元
	  			</p>
	  		</div>
	  		<div class="fl nujin_vip" v-if="btn_obj.active!==null&&order_data!==null">
	  			<input type="button" 
	  				@click="applyVip"
	  				value="开通VIP"
	  			/>
	  		</div>
	  </div>
      <div class="clearfix boxs advice_ctn">
        <!-- 多空预测-->
        <!-- <div :class="{blur_cover:username===false}"></div> -->
        <!-- <div class="blur_cover"></div> -->
        <div class="fl boxs"
		  title="点击查看看多策略"
          :style="styleDatas.p_style"
		  @click="handleIndicator('up')"
        >
          <span
            v-text="'多'+style_obj.positive+'%'"
			v-if="(typeof style_obj.positive)==='number'"
          >
          </span>
		  <span v-else
			v-text="style_obj.positive"
		  > 
		  </span>
        </div>
        <div class="fl boxs"
			title="点击查看看空策略"
          :style="styleDatas.n_style"
		  @click="handleIndicator('down')"
        >
          <span
            v-text="'空'+style_obj.negative+'%'"
			v-if="(typeof style_obj.negative)==='number'"
          >
          </span>
		  <span
			v-text="style_obj.negative"
			v-else
		  >  
		  </span>
        </div>
      </div>
    </div>
	</div>
</template>
<script src="./positive_negative.js"></script>
<style lang="less" src="./positive_negative.less" scoped></style>
