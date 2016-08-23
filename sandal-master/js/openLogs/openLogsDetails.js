/**
 * 已开通直播号列表页面的列表加载
 */
(function(window){
	window.hasOpenDetails = {
		orderId:CommonOper.getQueryStringS('id'),//订单ID
		/**
		*  页面初始化加载
		**/
		onLoad:function(){
			this.allTypeData();
		},
		/**
		 * 全部类型列表数据
		 */
		allTypeData:function(){
			var url =  '/openLogs/detail?id='+ hasOpenDetails.orderId;
			$.ajax({
				type: "post",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {
					if(data.code == 0){
						hasOpenDetails.allTypeDom(data);
					}
				}
		    });
		},
		/**
		 * 全部类型列表Dom
		 */
		allTypeDom:function(data){
			$('#productName').text(data.result.productName);
			$('#orderPrice').text(data.result.price);
			if(data.result.chargeType == 1){
				$('#chargeType').text('在线支付');
			}else if(data.result.chargeType == 0){
				$('#chargeType').text('线下支付');
			}
			if(data.result.chargeStatus == 1){
				$('#chargeStatus').text('未付费');
				$('#chargeStatus').addClass('remark');
			}else if(data.result.chargeStatus == 2){
				$('#chargeStatus').text('已付费');
			}
			
			if(data.result.openTime != 0){
				$('#openTime').text(new Date(data.result.openTime).format("yyyy-MM-dd HH:mm"));
			}
			if(data.result.expireTime != 0){
				$('#expireTime').text(new Date(data.result.openTime).format("yyyy-MM-dd HH:mm"));
			}else{
				$('#expireTime').text('永久');
			}
			if(data.result.status == 3){
				$('#status').text('正常使用');
			}else if(data.result.status == 4){
				$('#status').text('暂停使用');
			}else if(data.result.status == 6){
				$('#status').text('已到期');
			}else if(data.result.status == 7){
				$('#status').text('即将到期');
			}
			if(data.result.circleId != null){
				$('#circleName').text(data.result.circleName);
				$('#creatorName').text('群主：'+data.result.creatorName);
				$('#circleLogo').attr('src',data.result.circleLogo);
				$(".hasOpen_list_con").bind("click", function(){
					var circleId = data.result.circleId;
					var key = "15";//跳转到APP指定业务的代码
					m_app_native(circleId, key);
				});
			}else{
				$('.hasOpen_list_con,.has_title').hide();
			}
			
			$("#productName").bind("click", function(){
				var productId = data.result.productId;
				var liveCodeName = data.result.productName;
				var circleId = data.result.circleId;
				var toUrl = '/statics/html/liveCode/liveCodeDetails.html?t='+new Date().getTime();
				if(undefined!=typeof(productId) && null!=productId && ''!=productId){ toUrl += '&productId='+productId; }
				if(undefined!=typeof(liveCodeName) && null!=liveCodeName && ''!=liveCodeName){ toUrl += '&liveCodeName='+encodeURI(encodeURI(liveCodeName));}
//				if(undefined!=typeof(userId) && null!=userId && ''!=userId){ toUrl += '&userId='+userId;}
				if(undefined!=typeof(circleId) && null!=circleId && ''!=circleId){ toUrl += '&circleId='+circleId;}
//				if(undefined!=typeof(followerId) && null!=followerId && ''!=followerId){ toUrl += '&followerId='+followerId;};
				window.location.href = toUrl;
			});
		},
	};
	window.hasOpenDetails = hasOpenDetails;
})(window);


