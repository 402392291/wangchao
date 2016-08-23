$(function(){
	getRootPath();
	//var ctx = "";
});
var ctx = "";
/**
 * @param name 要获取的参数名
 * @returns 返回参数值
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}


function HTMLEncode(html) { 
	var temp = document.createElement ("div"); 
	(temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html); 
	var output = temp.innerHTML; 
	temp = null; 
	return output; 
}
 
function HTMLDecode(text) { 
	var temp = document.createElement("div"); 
	temp.innerHTML = text; 
	var output = temp.innerText || temp.textContent; 
	temp = null; return output; 
}

/**
 * 获取当前项目根路径
 */
function getRootPath(){ 
	var pathName = window.location.pathname.substring(1); 
	var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/')); 
//	ctx = window.location.protocol + '//' + window.location.host + '/'+ webName + '/';//不带项目名
	ctx = window.location.protocol + '//' + window.location.host + '/';//不带项目名
	return; 
} 
//当前日期,扩展Date的format方法 
Date.prototype.format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//字符串转日期
function convertDateFromString(dateString) {
	if (dateString) {
		var arr = dateString.split(/[- :]/);
		var date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
		return date;
	}
}

//  判断是否为掌门app，是为true，不是返回false
function isZmApp(){
	return (navigator.userAgent.toLowerCase().indexOf("zhangmen") > -1);
}

// 判断当前手机系统
function getMobileType(){
	if (navigator.userAgent.toLowerCase().indexOf("android") >-1)
		return "android";
	if (navigator.userAgent.toLowerCase().indexOf("iphone") >-1)
		return "iphone";
}



/**   
 *转换日期对象为日期字符串   
 * @param date 日期对象   
 * @param isFull 是否为完整的日期数据,   
 *               为true时, 格式如"2000-03-05 01:05:04"   
 *               为false时, 格式如 "2000-03-05"   
 * @return 符合要求的日期字符串   
 */    
 function getSmpFormatDate(date, isFull) {  
     var pattern = "";  
     if (isFull == true || isFull == undefined) {  
         pattern = "yyyy-MM-dd HH:mm:ss";  
     } else {  
         pattern = "yyyy-MM-dd";  
     }  
     return getFormatDate(date, pattern);  
 }  
 /**   
 *转换当前日期对象为日期字符串   
 * @param date 日期对象   
 * @param isFull 是否为完整的日期数据,   
 *               为true时, 格式如"2000-03-05 01:05:04"   
 *               为false时, 格式如 "2000-03-05"   
 * @return 符合要求的日期字符串   
 */    

 function getSmpFormatNowDate(isFull) {  
     return getSmpFormatDate(new Date(), isFull);  
 }  
 /**   
 *转换long值为日期字符串   
 * @param l long值   
 * @param isFull 是否为完整的日期数据,   
 *               为true时, 格式如"2000-03-05 01:05:04"   
 *               为false时, 格式如 "2000-03-05"   
 * @return 符合要求的日期字符串   
 */    

 function getSmpFormatDateByLong(l, isFull) {  
     return getSmpFormatDate(new Date(l), isFull);  
 }  
 /**   
 *转换long值为日期字符串   
 * @param l long值   
 * @param pattern 格式字符串,例如：yyyy-MM-dd HH:mm:ss   
 * @return 符合要求的日期字符串   
 */    

 function getFormatDateByLong(l, pattern) {  
     return getFormatDate(new Date(l), pattern);  
 }  
 /**   
 *转换日期对象为日期字符串   
 * @param l long值   
 * @param pattern 格式字符串,例如：yyyy-MM-dd HH:mm:ss   
 * @return 符合要求的日期字符串   
 */    
 function getFormatDate(date, pattern) {  
     if (date == undefined) {  
         date = new Date();  
     }  
     if (pattern == undefined) {  
         pattern = "yyyy-MM-dd HH:mm:ss";  
     }  
     return date.format(pattern);  
 }