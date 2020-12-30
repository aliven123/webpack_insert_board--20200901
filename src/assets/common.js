import CryptoJS from "crypto-js";
const IsPC=function() {
   var userAgentInfo = navigator.userAgent;
   var Agents = ["Android", "iPhone",
      "SymbianOS", "Windows Phone",
      "iPad", "iPod"];
   var flag = true;/* pc端是true,手机端是false */
   for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
         flag = false;
         break;
      }
   }
   return flag;
}();
const yAxisFormatter=function(value,tofix=1){
	/*echart中yAxis数据刻度过大的处理*/
	const txt=[];
	/*divisor：保留小数位除数*/
	const divisor=tofix==1?tofix:Math.pow(10,tofix);/*10的n次方*/
	const val=Math.abs(value);
	if(val>=10000&&val<100000000){
		txt.push(Math.round(value/10000*divisor)/divisor+'万');
	}else if(val>=100000000){
		txt.push(Math.round(value/100000000*divisor)/divisor+'亿');
	}else{
		txt.push(value);
	};
	return txt;
};
const ajaxfn=function(url,type,datatype,data,fn){	/*异步调用函数*/
	$.ajax({
		"url":url,
		"type":type,
		"async":true,
    "xhrFields":{
    	"withCredentials":true
    },
		"dataType":datatype,
		"data":data,
		"success":function(res){
			fn(res);
		},
		"error":function(XMLHttpRequest, textStatus, errorThrown) {
			 var result=XMLHttpRequest.status+","+XMLHttpRequest.readyState+","+textStatus;
			 fn(result);
			/* error事件返回的第一个参数XMLHttpRequest：
				XMLHttpRequest.readyState: 状态码的意思
				0 － （未初始化）还没有调用send()方法
				1 － （载入）已调用send()方法，正在发送请求
				2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
				3 － （交互）正在解析响应内容
				4 － （完成）响应内容解析完成，可以在客户端调用了*/
		 }
	});
};
const onAttach=function(element,type,callback){
  /*事件的监听*/
  if(element.addEventListener){
    element.addEventListener(type, callback, false);
  }else if(element.attachEvent){
    element.attachEvent('on' + type, callback);
  }else {
    element['on' + type] = callback;
  }
};
const Md5Dcode = function() {
	const search_obj=queryToObj();
	const encryptedBase64Str = search_obj.rdv;
	if(encryptedBase64Str!==undefined){
		const CRYPTOJSKEY = "0123456789123456";
		const vals = encryptedBase64Str.replace(/\-/g, '+').replace(/_/g, '/');
		const options = {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		};
		const key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
		const decryptedData = CryptoJS.AES.decrypt(vals, key, options);
		const decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData);
		return decryptedStr
	}else{
		return false
	}
};
const getUsername=function(){
	let username= document.querySelector("#hd #um .vwmy a");
	console.log(username);
	username =username?.innerHTML;
	if(!IsPC){
		username =document.querySelector('.ren_us_name')?.innerHTML;
		// ipad浏览时，IsPC也为false,username所在的标签和pc端一样，需要单独处理；
		let username_el=document.querySelector("#hd #um .vwmy a");
		if(username_el){
			username=username_el.innerHTML;
		}
		//ipad的处理逻辑结束
		
		if(username && username.includes('Hi') && username.includes('游客')){
			username=false;
		}
	};
	username=username?username:false;
	/* if(!username){
		// 如果用户名为false,则调用Md5Dcode，尝试解码通过url传递过来的usename
		username=Md5Dcode();
	} */
	return username
};
const localUsername=function(){
	let username = getUsername();
	if(location.href.includes('localhost')){
		username='lcs11';
	}else{
		if (!username) {
			username='';
		};	
	};
	return username;
};
const queryToObj=function(){
	const res={};
	const search=location.search.substr(1);
	search.split('&').forEach(paramStr=>{
		const arr=paramStr.split('=');
		const key=arr[0];
		const val=arr[1];
		res[key]=val;
	});
	return res;
};
const getherDatas=function(c_componentFn,getDataFn,ref_name){
	//收集组件之间数据的函数
	//1.c_componentFn是当前组件收集数据的函数名;
	//2.如果getDataFn存在就通过当前函数获取其它组件的数据
		//2.1.如果有ref_name就通过ref_name获取子组件的数据，
		//2.2如果没有ref_name就通过$parent获取父组件的数据
	//3.如果不存在直接获取当前组件需要收集的数据返回;
	
	const obj={};
	Object.assign(obj,this[c_componentFn]());
	if(getDataFn){
		let callback=null;
		console.log(getDataFn,ref_name);
		if(ref_name!==undefined){
			callback=this.$refs[ref_name][getDataFn];
		}else{
			callback=this.$parent[getDataFn];
		}
		Object.assign(obj,callback())
	};
	return obj;
};
const sleep=function(interval){
	// 睡眠函数
	return new Promise(resolve=>{
		setTimeout(resolve,interval);
	})
};
export default {
	IsPC,
	ajaxfn,
	yAxisFormatter,
	onAttach,
	getUsername,
	localUsername,
	queryToObj,
	getherDatas,
	sleep
};