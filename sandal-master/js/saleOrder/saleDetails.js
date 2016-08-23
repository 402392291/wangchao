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
			var url =  '/saleOrder/detail?id='+ hasOpenDetails.orderId;
			$.ajax({
				type: "GET",
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
			$('#orderName').text(data.result.productName);
			$('#orderPrice').text(data.result.price);
			if(data.result.chargeType == 1){
				$('#chargeType').text('在线支付');
			}else if(data.result.chargeType == 0){
				$('#chargeType').text('线下支付');
			}
			if(data.result.chargeStatus == 1){
				$('#chargeState').text('未付费');
				$('#chargeState').addClass('remark');
			}else if(data.result.chargeStatus == 2){
				$('#chargeState').text('已付费');
			}
			$('#orderNo').text(data.result.orderNo);
			if(data.result.openTime != 0){
				$('#openTime').text(new Date(data.result.openTime).format("yyyy-MM-dd HH:mm"));
			}
			$('#circleName').text(data.result.circleName);
		},
	};
	window.hasOpenDetails = hasOpenDetails;
})(window);


