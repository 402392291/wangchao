/**
 * user duxin
 * use 填写购买信息
 * createTime 2016-8-6
 */
var setOpenLiveCodeInfo = {
	mallId:'',
	followerId : getQueryString("followerId"),
	userId : getQueryString("userId"),//getQueryString("userId"),//用户id
	productId:getQueryString("productId"),//产品id
	productName:'',//产品名称
	walletServer:spreadTools.walletServerCfg(1),  //window.location.host,//获取当前域名
	circleId:getQueryString("circleId"),//社群id
	circleCode:getQueryString("circleCode"),//社群号
	agentCode:getQueryString("agentCode"),//邀请码
	agentName: decodeURI(getQueryString("agentName")),//营业厅名称
	change:getQueryString("change"),
	mobileBind:getQueryString("mobileBind"),
	chargeStatus:0,//线上线下
	price:'',//价格
	userMobile : getQueryString("userMobile"),//绑定的手机号
	userName : decodeURI(getQueryString("userName")),//用户名
	create:getQueryString("create"),//0创建社群     1已有社群选择开通的社群
	validCode:'',//验证码
	password:'',//密码
	circleName:'',//社群名称
	init:function(){
		this.linkWalletServerJs(this.walletServer);//引入支付js
		this.bindEventByChoosePay();//切换支付方式显示提示信息
		this.getCode();//获取邀请码		
		this.getProductInfo();//填写产品信息
		this.createOrderAndGoPay();	//提交订单
		this.controlPayMode();//控制支付方式
		this.isWeiXin();//在微信里面
	},
	/**
	 * [bindEventByChoosePay 给选择支付方式绑定事件]
	 * @return {[type]} [description]
	 */
	bindEventByChoosePay:function(){
		var that = setOpenLiveCodeInfo;
		$('.zbh_type .type_radio').bind('click',function(){
  			var index = $('.zbh_type .type_radio').index(this);
  			$('.type_radio').removeClass('check-radios');
  			$(this).addClass('check-radios');
  			if(index == 1){
  				$('.dx_xxzf_text').show();
  				if(that.agentName == '' || that.agentName == undefined || that.agentName == 'null' || that.agentName == 'undefined'){
  					$('.dx_xxzf_text #agentCode').hide();
  				}else{
  					$('.dx_xxzf_text #agentCode').show();
  					$('.dx_xxzf_text #agentCode a').text(that.agentName);
  				}
  				that.chargeStatus = 0;
  			}else{
  				$('.dx_xxzf_text').hide();
  				that.chargeStatus = 1;
  			}
  			
	  	});		
	},
	/**
	 * [areHaveCode 判断有没有邀请码]
	 * @return {[type]} [description]
	 */
	areHaveCode:function(code){
		if(code == '' || code == 'undefined' || code == null){
			$('#setCode').show();
			$('#codeText').hide();
		}else{
			$('#setCode').hide();
			$('#codeText').show();
			$('#codeText').text(code);
		}
	},
	/**
	 * [getCode 获取邀请码]
	 * @return {[type]} [description]
	 */
	getCode:function(){
		var code = this.agentCode;		
		this.areHaveCode(code);
	},
	/**
	 * [setChoosePay 设置选择支付]
	 */
	setChoosePay:function(payType){
		if(payType != '' || payType != undefined){
			if(payType == 0){
				$('.zbh_type li').eq(0).hide();
				$('.zbh_type li a').removeClass('check-radios');
				$('.zbh_type li a').eq(1).addClass('check-radios');
			}else{
				$('.zbh_type li a').eq(0).addClass('check-radios');
			}
		}
	},
	/**
	 * [getProductInfo 获取产品信息]
	 */
	getProductInfo:function(){
		var that = setOpenLiveCodeInfo;
		$.ajax({
			type: "Post",
			url: "/product/detail",
			data: "productId="+that.productId,
			dataType: "json",
			async:false,
			success: function (data) {
				if (data.code == 0) { 
					that.setProductInfo(data);
				}
			},
			error:function(e){
				console.log(e.message);
			}
		});
	},
	/**
	 * [setProductInfo 设置产品信息]
	 */
	setProductInfo:function(data){
		$('#productName').text(data.result.name);
		this.productName = data.result.name;
		$('#productPrice').text(data.result.price+'元');
		this.price = data.result.price;
		var limit = {'-1':'永久','7':'7天','30':'1个月','90':'3个月','365':'1年'};
		var limitDay = data.result.limitDay;
		if(limit[limitDay] == undefined){
			$('#productTime').text(data.result.limitDay+"天");
		}else{
			$('#productTime').text(limit[limitDay]);
		}
		this.mallId = data.result.mallId;
	},
	/**
	 * [getUserByCodeIsNull 判断用户是否填写邀请码]
	 */
	getUserByCodeIsNull:function(gaiayInviteCode){
		var setCode = $('#setCode').val();
		if(setCode == '' || setCode == undefined){
			setCode = gaiayInviteCode;
		}else{
			setCode = $('#setCode').val();
		}
		return setCode;
	},
	/**
	 * [goPay 创建订单并且去支付]
	 */
	createOrderAndGoPay:function(){
		var that = setOpenLiveCodeInfo;
		$('.dx_submit_btn').bind('click',function(){
			if(!isZmApp()){
				if(that.mobileBind == 'false' || that.mobileBind ==null){//没绑定手机号需要绑定手机号且创建社群
					if(!that.validIsNull()){
						return;
					}
					that.userMobile = $('#tel').val();
					that.validCode = $('#validCode').val();
					strlen('#password');
					that.password = $('#password').val();
					that.circleName = $('#circleName').val();	
				}else{
					if(that.create == 0){//创建社群
						if(!that.validIsNull()){
							return;
						}
						that.circleName = $('#circleName').val();
					}
				}				
			}			
			that.agentCode = that.getUserByCodeIsNull(that.agentCode);//赋值邀请码
			that.createOrder();			
	  	});
	},
	/**
	 * 非空判断
	 * @param obj
	 */
	validIsNull:function(){
		if($('#userInfo').css('display') == 'block'){
			if($('#tel').val() == ''){
				alert('请输入手机号，可用于登录掌门');
				return false;
			}
			if($('#validCode').val() == ''){
				alert('请输入验证码');
				return false;
			}
			if($('#password').val() == ''){
				alert('请输入手机登录密码');
				return false;
			}
		}
		if($('#createCircle').css('display') == 'block'){
			if($('#circleName').val() == ''){
				alert('请填写要开通增值服务的直播号');
				return false;
			}
		}
		return true;
	},
	
	isNotBank : function(str){
		return (undefined != typeof(str) && null != str && '' != str);
	},
	
	isNotBankDef : function(str, dv){
		return this.isNotBank(str) ? str : dv;
	},
	
	/**
	 * [createOrder 创建订单]
	 */
	createOrder:function(){
		var that = setOpenLiveCodeInfo;
		$.ajax({
			type:"post",
			url:"/api/buy-vas",
			data:{"userId" : that.isNotBankDef(that.userId, ""),
				"productId" :  that.isNotBankDef(that.productId, ""),
				"mallProductId" : that.isNotBankDef(that.mallId, ""),
				"circleId" : that.isNotBankDef(that.circleId, ""),
				"circleCode" : that.isNotBankDef(that.circleCode, ""),
				"inviteCode" : that.isNotBankDef(that.agentCode, ""),
				"change" : that.isNotBankDef(that.change, ""),
				"chargeStatus" : that.isNotBankDef(that.chargeStatus, ""),
				"followerId" : that.isNotBankDef(that.followerId, ""),
				"circleName" : that.isNotBankDef(that.circleName, ""),
				"mobile" : that.isNotBankDef(that.userMobile, ""),
				"password" : that.isNotBank(that.password) ? MD5(that.password) : "",
				"validCode" : that.isNotBank(that.validCode, "")},
			dataType:"json",
			success:function(data){
				if(data.code == 0){					
					if(that.chargeStatus == 1){
						wallet.pay(data.result.orderSerialNumberId, data.result.appKey, data.result.appDomain, data.result.price, data.result.redirectUrl,that.productName,'','web');
					}else{
						var toUrl = '/apply/apply-success?t='+new Date().getTime();
						if(that.isNotBankDef(that.circleId)){ toUrl += '&circleId='+that.circleId; }
						if(that.isNotBankDef(that.productId)){ toUrl += '&productId='+that.productId; }
						if(that.isNotBankDef(that.userId)){ toUrl += '&userId='+that.userId; }
						if(that.isNotBankDef(that.change)){ toUrl += '&change='+that.change;}
						if(that.isNotBankDef(that.chargeStatus)){ toUrl += '&chargeStatus='+that.chargeStatus;}
						if(that.isNotBankDef(that.followerId)){ toUrl += '&followerId='+that.followerId; }
						if(that.isNotBankDef(data.result)){ toUrl += '&applyId='+data.result; }//获取applyId
						toUrl += '&state=0';
						window.location.href = toUrl;//'/apply/apply-success?circleId='+that.circleId+'&productId='+that.productId+'&userId='+that.userId+'&state =0'+'&followerId='+that.followerId;
					}					
				}else{
					alert(data.message);
				}
				$('.dx_submit_btn').text('提交中...');
				$('.dx_submit_btn').unbind();
			}
		});
	},
	/**
	 * [linkWalletServerJs 引入支付js]
	 * @param walletServer
	 */
	linkWalletServerJs:function(walletServer){
		$('body').append('<script src="http://'+walletServer+'/statics/js/wallet.sdk.js"></script>');
	},
	/**
	 * [ 在微信里面的业务]
	 */
	isWeiXin:function(){
		if(!isZmApp()){
			$("#pointCode").text("打款成功后请电话联系我们的客服:");
			if(this.mobileBind == 'false' || this.mobileBind ==null){
				$('#userName').text(this.userName);
				$('#userInfo').show();
				$('#createCircle').show();
				$('#requestCode').show();
			}else{
				if(this.create == '0'){
					$('#userInfo').hide();
					$('#createCircle').show();
					$('#requestCode').show();
				}else{
					$('#userInfo').hide();
					$('#createCircle').hide();
					$('#requestCode').show();
				}
			}
		}else{
			$('#userInfo').hide();
			$('#createCircle').hide();
			$('#requestCode').show();
			$("#pointCode").text("打款成功后掌信咨询客服或拔打客服电话:");
		}
		
	},
	/**
	 * [controlPayMode 支付方式]
	 */
	controlPayMode:function(){
		var num = '';
		if(spreadTools.isWeiXin()||isZmApp()){
			num = spreadTools.paymentMode(this.price,3000);
		}else{
			num = spreadTools.paymentMode(this.price,6000);
		}
		this.setChoosePay(num);
		this.chargeStatus = num;
	},
};
setOpenLiveCodeInfo.init();
var bindMobileValid = "false";
$("#btn_validCode").attr("onclick","");
$("#tel").keyup(function(){
	if($("#tel").val() != ''){
		$("#btn_validCode").removeClass("qb").attr("onclick","send_ValidCode()");
	}else{
		$("#btn_validCode").addClass("qb").attr("onclick","");
	}
});
$("#tel").blur(function(){
	if($("#tel").val() != ''){
		$("#btn_validCode").removeClass("qb").attr("onclick","send_ValidCode()");
	}else{
		$("#btn_validCode").addClass("qb").attr("onclick","");
	}
});
function strlen(obj){
	var i_value = $(obj).val(),
		i_size = $(obj).data("size").split('|')[0],
	    i_name = $(obj).data("size").split('|')[1],
	    len = 0;
    for (var i=0; i<i_value.length; i++) { 
     var c = i_value.charCodeAt(i); 
     //单字节加1 
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
         len++; 
     }else { 
    	 len+=2; 
     } 
    } 
    if(i_name == "密码"){
    	if(len < 6){
        	alert("密码不能小于6个字符");
        	return true;
        }else if(16 < len){
        	alert("密码不能大于16个字符");
        	return true;
        }
    }else{
    	if(len > i_size){
        	alert(i_name+"不能超过"+i_size+"个字符");
        	return true;
        }
    }
    return false;
}
var validate_timecount = 60;
var validate_time_timer;
function processValidateTimeout_1() {
	$("#btn_validCode").css('pointer-events',"none");
	var textnumber = validate_timecount + "s后获取";
	if (validate_timecount > 0) {
		$("#btn_validCode").val(textnumber);
	}
	validate_timecount--;
	if (validate_timecount < 0) {
		$('#btn_validCode').removeClass('qb').val("获取验证码"); 
		validate_timecount = 60;
		clearInterval(validate_time_timer);
		$("#btn_validCode").removeAttr("style");
	}
}

function send_ValidCode(source) {
	clearInterval(validate_time_timer);
	if ($("#tel").val() == "") {
		alert("请输入手机号");
		return false;
	}
	var re = new RegExp(/^(13[0-9]|15[0123456789]|18[0123456789]|14[57]|17[0678])[0-9]{8}$/);
	if (!re.test($("#tel").val())) {
		alert("手机号格式不正确");
		return false;
	}
	$.ajax({
		type:"put",
		url:"/api/capthca",
		data:"mobile="+$("#tel").val(),
		dataType:"json",
		success:function(data){
			if(data.code == 0){					
				processValidateTimeout_1();
				$('#validCode').val(data.capthcaCode);
			}else{
				alert(data.message);
			}
		}
	});
}
