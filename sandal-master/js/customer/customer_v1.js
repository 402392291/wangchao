var MA_CST = {
		serverUrl:"",
		// 请求绑定
		invite : function(circleId, agCode, callback){
			$.ajax({
				url:ctx+"custom/"+circleId + "/invited?agCode=" +agCode,
				type:"GET",
				success:function(data){
					callback(data.code, data.data);
				},
				error:function(state,data){
					callback(-1, "服务器请求错误");
				}
			});
		},
		// 开通直播号
		open : function(circleId, agCode, pid){ 
			if (typeof(pid) != "undefined")
				window.location.href=ctx+"/agent/set/product_type?agentCode="+agCode+"&circleId="+circleId+"&productId="+pid;
			else
				window.location.href=ctx+"/agent/set/product_type?agentCode="+agCode+"&circleId="+circleId;			
		},
		// 暂停/恢复使用
		pause : function(circleId, agCode, status){
			$.ajax({
				url:ctx+"custom/"+circleId + "/status?agCode=" +agCode + "&pause="+status,
				type:"POST",
				success:function(data){
					if(data.code == 0) {
						window.location.reload();
					}
				}
			});			
		},
		// 设置直播号
		setLive : function(circleId, agCode, pid, applyId){
			window.location.href=ctx + "/agent/set/product_type_update?agentCode=" 
				+ agCode + "&circleId=" + circleId + "&productId=" + pid + "&applyId=" + applyId;
		},
		/**
		 * 咨询群主的方法
		 */
		zixuncircle:function(){
			$(".zixunCircle").bind("click", function() {
				var key = "33";//跳转到掌信的业务代码
				m_app_native(circleCreator, key, '', '{}');
			});

		},
		/**
		 * 待开通申请的拒绝方法
		 */
		refuseApply:function(){
			$.ajax({
				url:"/agent/set/refuse?applyId=" +applyId ,
				type:"get",
				success:function(data){
					window.location.reload();
					$("#refuse").hide();
				}
			});
		},
		/**
		 * 添加页面信息数据
		 */
		customInfoData:function(){
			//已开通的状态信息
			var type = '';//付费方式
			var chargeS = '';//付费状态
			var customS = '';//使用状态
			if(chargeType == 1){
				type = '线上';
			}else{
				type = '线上';
			}
			if(chargeStatus == 2){
				chargeS = '已付费';
			}else{
				chargeS = '未付费';
				$(".chargeStatus p:nth-child(2)").css({"color":"#ff2d2d"});
			}
			if(customStatus == 3){
				customS = '正在使用';
			}else if(customStatus == 4){
				customS = '暂停使用';
			}else if(customStatus == 6){
				customS = '已到期';
			}else if(customStatus == 7){
				customS = '即将到期';
			}
			$(".startTime p:nth-child(2)").text(new Date(parseInt(startTime)).format("yyyy-MM-dd"));
			$(".expireTime p:nth-child(2)").text(new Date(parseInt(expireTime)).format("yyyy-MM-dd"));
			$(".chargeType p:nth-child(2)").text(type);
			$(".chargeStatus p:nth-child(2)").text(chargeS);
			$(".customStatus p:nth-child(2)").text(customS);
			//待开通的状态信息
			var applyType = '';//付费方式
			var applyChargeS = '';//付费状态
			if(applyChargeType == 1){
				applyType = '线上';
			}else{
				applyType = '线下';
			}
			if(applyCustomStatus == 2){
				applyChargeS = '已付费';
			}else{
				applyChargeS = '未付费';
				$(".chargeStatus p:nth-child(2)").css({"color":"#ff2d2d"});
			}
			$(".applyTime p:nth-child(2)").text(new Date(parseInt(applyTime)).format("yyyy-MM-dd"));
			$(".applyChargeType p:nth-child(2)").text(applyType);
			$(".applyCustomStatus p:nth-child(2)").text(applyChargeS);
		},
		/*
		 * //已开通页面的数据
		 */
		applycustomInfo:function(){
			//已开通的状态信息
			var type = '';//付费方式
			var chargeS = '';//付费状态
			var customS = '';//使用状态
			if(chargeType == 0){
				type = '线下';
			}else if(chargeType == 1){
				type = '线上';
			}
			if(chargeStatus == 1){
				chargeS = '未付费';
				$(".chargeStatus p:nth-child(2)").css({"color":"#ff2d2d"});
			}else if(chargeStatus == 2){
				chargeS = '已付费';
			}
			if(customStatus == 3){
				customS = '正在使用';
			}else if(customStatus == 4){
				customS = '暂停使用';
			}else if(customStatus == 6){
				customS = '已到期';
			}else if(customStatus == 7){
				customS = '即将到期';
			}
			$(".startTime p:nth-child(2)").text(new Date(parseInt(startTime)).format("yyyy-MM-dd"));
			$(".expireTime p:nth-child(2)").text(new Date(parseInt(expireTime)).format("yyyy-MM-dd"));
			$(".chargeType p:nth-child(2)").text(type);
			$(".chargeStatus p:nth-child(2)").text(chargeS);
			$(".customStatus p:nth-child(2)").text(customS);
		},		
};