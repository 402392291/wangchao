/**
 * 手机端使用的js，用于调用手机端的方法
 * 
 * 判断是否是手机端 if (typeof(_platform) != "undefined" && _platform != "") {...}
 */

// IOS用的JS调用
(function(context){
    function bridgeCall(src,callback) {
    	var iframe;
    	iframe = document.createElement("iframe");
    	iframe.setAttribute("src", src);
    	iframe.setAttribute("style", "display:none;");
    	iframe.setAttribute("height", "0px");
    	iframe.setAttribute("width", "0px");
    	iframe.setAttribute("frameborder", "0");
    	document.body.appendChild(iframe);
    	iframe.parentNode.removeChild(iframe);
    	iframe = null;
        if(callback) callback();
	}
	
    function JSBridge()
    {
        this.callbackDict = {};
        this.notificationIdCount = 0;
        this.notificationDict = {};
        this.isIOS = false;
        
        var that = this;
        context.document.addEventListener('DOMContentLoaded',function(){
            bridgeCall('jsbridge://NotificationReady',that.trigger('jsBridgeReady',{}));
        },false);
    }

    JSBridge.prototype = {
        constructor: JSBridge,
        //send notification to WebView
        postNotification: function(name, userInfo){
            this.notificationIdCount++;
            
            this.notificationDict[this.notificationIdCount] = {name:name, userInfo:userInfo};

            bridgeCall('jsbridge://PostNotificationWithId-' + this.notificationIdCount);
        },
        //pop the notification in the cache
        popNotificationObject: function(notificationId){
            var result = JSON.stringify(this.notificationDict[notificationId]);
            delete this.notificationDict[notificationId];
            return result;
        },
        //trigger the js event
        trigger: function(name, userInfo) {
            if(this.callbackDict[name]){
                var callList = this.callbackDict[name];
                
                for(var i=0,len=callList.length;i<len;i++){
                    callList[i](userInfo);
                }
            }
        },
        //bind js event
        bind: function(name, callback){
            if(!this.callbackDict[name]){
                //create the array
                this.callbackDict[name] = [];
            }
            this.callbackDict[name].push(callback);
        },
        //unbind js event
        unbind: function(name, callback){
            if(arguments.length == 1){
                delete this.callbackDict[name];
            } else if(arguments.length > 1) {
                if(this.callbackDict[name]){
                    var callList = this.callbackDict[name];
                    
                    for(var i=0,len=callList.length;i<len;i++){
                        if(callList[i] == callback){
                            callList.splice(i,1);
                            break;
                        }
                    }
                }
                if(this.callbackDict[name].length == 0){
                    delete this.callbackDict[name];
                }
            }
        }
        
    };
     
    context.jsBridge = new JSBridge();
    context.jsBridge.bind("iPhone", function(userInfo){
    	jsBridge.isIOS = true;
    });
    context.jsBridge.bind("publishBoss",function(){
    	publish.publish_topic();
    });
    
})(window);

// 手机端app通用的JS方法
var _platform = "";
if (window.doAndroid) {
	_platform = "android";
}else{
	var userAgent = window.navigator.userAgent.toLowerCase();
	if (getQueryString("platform") || userAgent.indexOf("zhangmen") != -1) {
		_platform = "ios";
	}
}
var enviRc = "rc";
var enviGray = "beta";
var enviTest = "alpha";

function getEnvi(){
	var userAgent = window.navigator.userAgent;
	if(userAgent.indexOf(enviRc) != -1){
		return envi;
	}else if(userAgent.indexOf(enviGray) != -1){
		return enviGray;
	}else if(userAgent.indexOf(enviTest) != -1){
		return enviTest;
	}
}

/**
 * 获取地址栏上的参数，如果没有不管什么类型返回""
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return "";
}
/**
 * 获取地址栏上的参数，如果没有不管什么类型返回null
 */
function getQueryNull(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function m_app_is_Android() {
	return window.doAndroid;
}

function m_app_is_iOS() {
	return _platform == "ios" || jsBridge.isIOS;
}

function m_app_platform() {
	if (window.doAndroid) {
		return "android";
	} else if (m_app_is_iOS()) {
		return "ios";
	}
	return "";
}

function m_app_getUserInfo(){
	var userInfo = "{}";
	try{
		if(m_app_is_iOS()){
			var version = m_app_getVersion();
			// liujt 2016-1-6 ios从5.4.1开始使用新的交互方式
			if(version >= 541){
				userInfo = ios.getUserInfo();
			}else{
				var userAgent = window.navigator.userAgent;
				if(userAgent.indexOf("userInfo=")>0){
					var temp = userAgent.split("userInfo=")[1].split("}/")[0];
					if(temp != ""){
						var t = "["+temp+"}]";
						userInfo = eval(t)[0];
					}
				}
			}
		}else if(m_app_is_Android()){
			var temp = window.doAndroid.getUserInfo();
			if(temp != ""){
				var t = "["+temp+"]";
				userInfo = eval(t)[0];
			}
		}	
	}catch(e){
		console.log(e);
	}
	return userInfo;
}


// 是否是手机端登录
function m_app_is_mobile() {
	var _platform = m_app_platform();
	if (_platform != "" && (_platform == "android" || _platform == "ios")) {
		return true;
	}
	return false;
}

/**
*	头像（头像URL）
*	姓名
*	提示（我成为了［社群名字］会员，你也加入吧！）
*	推广语
*	生成二维码的地址
*	社群名字
*/
function m_app_toSaQR(uLogo, uName, tip, saleLau, openUrl, cName){
	var data ='{"type":371,"userLogo":"'+uLogo+'","userName":"'+uName+'","tip":"'+tip+'","saleLau":"'+saleLau+'","openUrl":"'+openUrl+'","circleName":"'+cName+'"}';
	m_app_native("", 37, "", data);
}

/**
 * 描述：掌门网页和APP原生界面交互接口
 * @param id 业务id
 * @param type 业务类型，参见api文档中的业务类型定义;打开新的webview，不打开新的webview
 * @param url 业务对应的网页url
 */
function m_app_native(id, type, url, data){
	var version = m_app_getVersion();
	if(m_app_is_Android()){
		if(version >= 40){
			if((type == 100 && version >= 532) || type != 100){
				if(version >= 560){
					window.doAndroid.toNative('{"id":"'+id+'", "type":"'+type+'", "url": "'+url+'", "data":'+data+'}');
				}else if(type ==35){
					openUrl(url);
				}else{
					window.doAndroid.toNative('{"id":"'+id+'", "type":"'+type+'", "url": "'+url+'"}');
				}
				
			}else{
				openUrl(url);
			}
		}else{
			if(version >= 37){
				if(type == 26){
					m_app_audioDetail(id, url);
				}else if(type == 15){
					m_app_circleDetail(id);
				}
			}
		}
	}else if(m_app_is_iOS()){
		if(version >= 523){
			if((type == 100 && version >= 532) || type != 100){
				if(version >= 560){
					jsBridge.postNotification("m_app_native", {"id":""+id+"","type": ""+type+"","url": ""+url+"", "data":""+data+""});
				}else if(type ==35){
					openUrl(url);
				}else{
					jsBridge.postNotification("m_app_native", {"id":""+id+"","type": ""+type+"","url": ""+url+"",});
				}
			}else{
				openUrl(url);
			}
		}else{
			if(type == 26 && version >= 510){
				m_app_audioDetail(id, url);
			}else if(type == 15){
				m_app_circleDetail(id);
			}
		}
	}else{
		openUrl(url);
	}
	return;
}

/**
 * 描述：掌门开放给直播的js方法，可以调用到掌门APP原生方法，进入到音频播放原生界面
 * @param id 音频id
 */
function m_app_audioDetail(id, url){
	var version = m_app_getVersion();
	//安卓从37版本号之后开始支持音频原生化
	if(m_app_is_Android() && version >= 37){
		if((version >= 40 && version.length == 2) || version.length == 3){
			if((type == 100 && version >= 532) || type != 100){
				window.doAndroid.toNative('{"id":"'+id+'", "type":"26"}');
			}else{
				openUrl(url);
			}
		}else{
			window.doAndroid.toAudioDetail(id);
		}
	}else if(m_app_is_iOS() && version >= 510){
		if(version >= 523){
			if((type == 100 && version >= 532) || type != 100){
				jsBridge.postNotification("m_app_native", {"id":""+id+"","type": "26"});
			}else{
				openUrl(url);
			}
		}else{
			jsBridge.postNotification("toAudioDetail", {"id":id});
		}
	}else{
		openUrl(url);
	}
	return;
}

function openUrl(url){
	if(url != undefined && url != ""){
		window.location.href = url;
	}
}

/**
 * 描述：掌门APP给网页开放的js方法，可以调用到掌门APP原生方法，进入到社群原生界面
 * @param circleId 社群id
 * @param followerId 分销者id
 */
function m_app_circleDetail(circleId, followerId){
	followerId = (followerId == 'undefined') ? "" : followerId; 
	var version = m_app_getVersion();
	if(m_app_is_Android()){
		if((version >= 40 && version.length == 2) || version.length == 3){
			window.doAndroid.toNative('{"id":"'+circleId+'", "type":"15", "data":{"type":1,"followerId":"'+followerId+'","circleId":"'+circleId+'"}}');
		}else{
			window.doAndroid.toGroupDetail(circleId);
		}
	}else if(m_app_is_iOS()){
		if(version >= 523){
			jsBridge.postNotification("m_app_native", {"id":""+circleId+"","type": "15", "data":{"type":1,"followerId":""+followerId+"","circleId":""+circleId+""}});
		}else{
			jsBridge.postNotification("toGroupDetail", {"circleId":circleId});
		}
	}else{
		window.location.href = "/zhangmen/circle/shared-detail-" + circleId +"/123?followerId="+followerId ;
	}
}

function m_app_showOptionMenu(menus){
	
}

/**
 * @param menus : onMenuShare(分享),openWithSafari:safari浏览器打开,copyUrl：复制链接地址,refresh:刷新
 */
function m_app_showOptionMenu(menus){
	if(menus.constructor == Array ){
//		var meunsJosn = {"onMenuShare":true,"openWithSafari":true,"copyUrl":true,"refresh":true};
		var meunsJosn ={};
		for(var menu in menus){
			meunsJosn[menu] = true;
		}
		if(m_app_is_iOS()){
			ios.appMenuEnable(meunsJosn);
		}else{
			
		}	
	}else{
		console.log("菜单注册，非法数据");
	}
}

/**
 * @param menus : onMenuShare(分享),openWithSafari:safari浏览器打开,copyUrl：复制链接地址,refresh:刷新
 */
function m_app_hideOptionMenu(menus){
	if(menus.constructor == Array ){
		var meunsJosn = {};
		for(var menu in menus){
			meunsJosn[menu] = false;
		}
		if(m_app_is_iOS()){
			ios.appMenuEnable(meunsJosn);
		}else{
			
		}	
	}else{
		console.log("菜单注册，非法数据");
	}
}

function m_app_getVersion(){
	var version = 0;
	if(m_app_is_iOS()){
		try{
			var o = ios.appVersion();
			version = o.appVersion;
		}catch(e){
			var userAgent = window.navigator.userAgent.toLowerCase();
			if(userAgent.indexOf("zhangmen/") > -1){
				version = userAgent.split("zhangmen/")[1].split(" ")[0];
			}else{
				version = userAgent.split("v")[1].split(",")[0];
			}
			
		}
		version = version.replace(".","").replace(".","");
		if(version.length == 2){
			version = version +0;
		}
	}else if(m_app_is_Android()){
		try{
			version = window.JSLogin.getVersion();
			if(version.indexOf(".") > 0){
				version = version.replace(".","").replace(".","");
			}
		}catch(e){
			console.log("获取版本号失败");
		}
	}
	return version;
}
