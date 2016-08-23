/**
 * 已开通直播号列表页面的列表加载
 */
(function(window){
	window.listOrCircle = {
		agentCode:CommonOper.getQueryStringS('agentCode'),
		circleId:CommonOper.getQueryStringS('circleId'),
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
			var url =  '/openLogs/list?agentCode='+ listOrCircle.agentCode +'&circleId='+listOrCircle.circleId;
			$.ajax({
				type: "post",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {
					if(data.code == 0){
						listOrCircle.allTypeDom(data);
					}
				}
		    });
		},
		/**
		 * 全部类型列表Dom
		 */
		allTypeDom:function(data){
			 var result= data.result.result;
			if(result.length != undefined && result.length > 0){
				var html = '';
				for (var i = 0; i < result.length; i++) {
					html += '<article class="zbh_state"><nav class="zbh_name"><li>';
					html += '<p class="productName" data-productId="'+result[i].productId+'" data-circleId="'+result[i].circleId+'">'+result[i].productName+'</p></li></nav><nav class="zbh_xq">';
					if(result[i].openTime != 0){
						html += '<li><p>开通时间</p><p>'+new Date(result[i].openTime).format("yyyy-MM-dd HH:mm")+'</p></li><li>';
					}
					if(result[i].expireTime != 0){
						html += '<p>到期时间</p><p>'+new Date(result[i].expireTime).format("yyyy-MM-dd HH:mm")+'</p></li><li>';
					}else{
						$('#expireTime').text('永久');
					}
					if(result[i].chargeType == 0){
						html += '<p>付费方式</p><p>线下支付</p></li>';
					}else{
						html += '<p>付费方式</p><p>在线支付</p></li>';
					}
					
					if(result[i].chargeStatus == 2){
						html += '<li><p>付费状态</p><p>已付费</p></li>';
					}else if(result[i].chargeStatus == 1){
						html += '<li><p>付费状态</p><p>未付费</p></li>';
					}
					if(result[i].status == 3){
						html += '<li><p>使用状态</p><p>正常使用</p></li>';
					}else if(result[i].status == 7){
						html += '<li><p>使用状态</p><p>即将到期</p></li>';
					}else if(result[i].status == 6){
						html += '<li><p>使用状态</p><p>已到期</p></li>';
					}else if(result[i].status == 4){
						html += '<li><p>使用状态</p><p>暂停使用</p></li>';
					}	
					html +='</nav></article>';
				}
				$('.alreadyZbh').append(html);
				$(".productName").bind("click", function(){
					var productId = $(this).attr('data-productId');
					var liveCodeName = $(this).text();
					var circleId = $(this).attr('data-circleId');
					var toUrl = '/statics/html/liveCode/liveCodeDetails.html?t='+new Date().getTime();
					if(undefined!=typeof(productId) && null!=productId && ''!=productId){ toUrl += '&productId='+productId; }
					if(undefined!=typeof(liveCodeName) && null!=liveCodeName && ''!=liveCodeName){ toUrl += '&liveCodeName='+encodeURI(encodeURI(liveCodeName));}
//					if(undefined!=typeof(userId) && null!=userId && ''!=userId){ toUrl += '&userId='+userId;}
					if(undefined!=typeof(circleId) && null!=circleId && ''!=circleId){ toUrl += '&circleId='+circleId;}
//					if(undefined!=typeof(followerId) && null!=followerId && ''!=followerId){ toUrl += '&followerId='+followerId;};
					window.location.href = toUrl;
				});
			}
		},
	};
	window.listOrCircle = listOrCircle;
})(window);


