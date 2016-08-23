// 需要基础支撑的js
// 基础功能 getQueryString 需要 mobileCommon.js 支持
// 微信相关功能，需要wxHelper-6.1.js支持，还需要引入微信官网js sdk
//	掌门js 开发环境 http://dev.zm.gaiay.net.cn/js/mobile/mobile.js
// SERVICE_BASE服务地址，定义与mobileCommon.js内

// 页面分享属性封装
var shareObj={
	title:"",
	desc:"",
	link:"",
	img:"",
	serverUrl:"",
	id:"",
	type:""
};

// 页面业务属性封装
var actBase={
	openId : getQueryString("openId") == null ? "" : getQueryString("openId"),
	userId : getQueryString("userId") == null ? "" : getQueryString("userId"),
	activityId : getQueryString("activityId") == null ? "" : getQueryString("activityId"),
	bizType:"games",
	browserType : "default"
};

// 入口对象工厂类，根据user-agent返回入口对象
// 入口对象需要 设置type属性
// 入口对象需要实现 init接口
function getEntry(){
	var userAgent = navigator.userAgent;
	var retObj;
	if (userAgent.indexOf("MicroMessenger") > -1)
		retObj = getWxEntry();
	else if (userAgent.toLowerCase().indexOf("zhangmen") > -1)
		retObj = getZmEntry();
	else 
		retObj =getDefaultEntry();
	actBase.browserType = retObj.type;
	return retObj;
};

// 返回微信入口对象
function getWxEntry(){
	var obj = new Object();
	// 入口对象统一类型属性
	obj.type = "wx";
	
	// 入口对象统一接口
	obj.init = function(){
		obj.getUser();
		obj.share();
	};
	
	// 获取用户信息
	obj.getUser = function(){
		// update 2015.12.14
		// 替换为微信授权服务授权
		var userId = getQueryString("currentUserId");
		if (!userId)
			alert("微信授权异常");
		else
			getZmUserInfo(userId);
		// end		
	}
	obj.share=function(){
		share.parserUrl = false;
		share.shareCount = false;
		share.weixinTimeline(shareObj.link, shareObj.title, shareObj.img);
		//资讯分享到微信好友、qq好友初始化分享内容
		share.weixinFirends(shareObj.link, shareObj.desc, shareObj.title, shareObj.img);	
	};
	
	// 进入宿主主页
	obj.gotoOwnerIndex = function(url, id, type){
		// 掌门社群跳转页面
		switch(type)
		{
		default:window.location.href=url;
		break;
		}
	};
	return obj;
};

// 返回掌门入口对象
function getZmEntry(){
	var obj = new Object();
	obj.type = "zm";

	// 入口对象统一接口
	obj.init = function(){
		obj.getUser();
		obj.share();
	};
	
	obj.getUser = function(){
		var zmBase = m_app_getUserInfo();
		getZmUserInfo(zmBase.userId);
		//getZmUserInfo("74752514d03ac22a1-8000");	
		//掌门分享
	};
	
	obj.share=function(){
	};
	
	// 进入掌门社群
	// 进入宿主主页
	obj.gotoOwnerIndex = function(url, id, type){
		// 掌门社群跳转页面
		switch(type)
		{
		// 掌门传媒应该使用原生app打开主页，暂时先跳转页面
		case "ZM_COMMUNITY":
			if(typeof(m_app_native) == "undefined")
				window.location.href=url;
			else
				m_app_native(id, 15);
			break;
		default:
			window.location.href=url;
		break;
		}
	};
	return obj;	
};

function getDefaultEntry(){
	var obj = new Object();
	obj.type = "default";

	// 入口对象统一接口
	obj.init = function(){
		obj.getUser();
		obj.share();
	};
	
	obj.getUser = function(){
		actBase.openId = "default";
		actBase.userId = "0";
	};
	obj.gotoOwnerIndex = function(url, id, type){
		window.location.href=url;
	};
	obj.share=function(){
	};	
	
	return obj;
};

function getZmUserInfo(zmUserId){
	actBase.openId = zmUserId;
	if (!zmUserId){
		alert("掌门用户错误：" + zmUserId);
	}
	var servic = "gameApi";
	if (actBase.bizType == "votes")
		servic ="voteApi";
	var baseUrl = shareObj.serverUrl =="" ? ctx :shareObj.serverUrl;
	$.ajax({
		url:baseUrl + 'webapp/'+servic+'/'+actBase.activityId+'/' + zmUserId + '/UserInfo',
		type:'get',
		async:false, 
		 success: function(data){
			 if(data.code==0){
			 	actBase.userId = data.result.userId;
			 }else{
				 alert("获取掌门用户信息失败","error"); 
			 }
		   },
		error:function(){
			alert("获取掌门用户信息失败");
		}
	});
};

function zmShare(){
	var share = '{"title":"'+shareObj.title + '","pic":"'+shareObj.img + '","desc":"' + shareObj.desc + '","link":"'+shareObj.link+'"';
	if (shareObj.id != "" && shareObj.type != "")
		share = share + ', "id":"' + shareObj.id + '", "type":' + shareObj.type;
	share = share + "}";
	return share ;
};