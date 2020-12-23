export const maxZindex=function(){ //最大的zindex
	let z_Index=Number.parseInt(new Date().getTime()/100).toString();
	let last=z_Index.length-1;
	z_Index=z_Index.substring(last-9,last);
	return z_Index;
};
