//移动端版本兼容
//  判断是否为掌门app，是为true，不是返回false
function isZmApp(){
	return (navigator.userAgent.toLowerCase().indexOf("zhangmen") > -1);
}
//判断当前手机系统
function getMobileType(){
	if (navigator.userAgent.toLowerCase().indexOf("android") >-1)
		return "android";
	if (navigator.userAgent.toLowerCase().indexOf("iphone") >-1)
		return "iphone";
}
if(isZmApp()==true&&getMobileType()=="android"){
	$("html").css('font-size','9.5px');
	if($(window).width()==384){
		$("html").css('font-size','10.5px');
	}
}else{
	//移动端版本兼容
	var viewport = document.querySelector("meta[name=viewport]");
	var winWidths=$(window).width();
	var densityDpi=750/winWidths;
	densityDpi= densityDpi>1?300*750*densityDpi/750:densityDpi;
	$('#zmStyle').remove();
	if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
		var version = parseFloat(RegExp.$1);
		if(version>2.3){
	 		var phoneScale = parseInt(window.screen.width)/750;
	 		viewport.setAttribute('content', 'width=750, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi');
		}else{
			viewport.setAttribute('content', 'width=750, target-densitydpi=device-dpi');
	 	}
	 }else{
	 	viewport.setAttribute('content', 'width=750, user-scalable=no, target-densitydpi=device-dpi');
	}
}