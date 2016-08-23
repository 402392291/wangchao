/**
 * 已开通直播号列表页面的列表加载
 */
(function(window){
	window.lowerProDetail = {
		/**
		*  页面初始化加载
		**/
		onLoad:function(){
			this.lowerProDetailData();
		},
		/**
		 * 验证字对是是否为示未定定义
		 */
		typeOfValue:function(value){
			if(typeof(value) == "undefined" || value == null){
				value = "";
			}
			return value;
		},
		
		/**
		 * 加载推广者信息数据
		 */
		lowerProDetailData:function(){
			var url = '/follower/detail?agentCode='+agentCode+'&userId='+userId;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {	
					if(data.code == 0){
						var datas = data.result;
						var pic = lowerProDetail.typeOfValue(datas.userLogo);
						var parentPic = lowerProDetail.typeOfValue(datas.parentLogo);
						if(pic == ''){
							pic = '/statics/images/promotion/headPic.png';
						}
						if(parentPic == ''){
							pic = '/statics/images/promotion/headPic.png';
						}
						$(".spreadSate_user dt img").attr("src",pic);
						if(datas.parentId == '' || datas.parentId == null){
							$(".spreadParent").hide();
						}
						$(".spreadSate_user dd").text(lowerProDetail.typeOfValue(datas.userName));
						$("#earning").text(lowerProDetail.formatCurrency(datas.sealRoom));
						$("#totalProfit").text(lowerProDetail.formatCurrency(datas.earning));
						$("#spreadLevel_user dt img").attr("src",parentPic);
						$("#spreadLevel_user dd").text(lowerProDetail.typeOfValue(datas.parentName));
						$("#spreadLower").text(datas.firstCount);
					}
					
				}
		    });
		},
		/**
		 * 格式化数字
		 * @param num
		 * @returns
		 */
		formatCurrency : function (num) {
			if(num == 0) return 0;
			num = num.toString().replace(/\$|\,/g,'');
		    if(isNaN(num))
		    num = "0";
		    sign = (num == (num = Math.abs(num)));
		    num = Math.floor(num*100+0.50000000001);
		    cents = num%100;
		    num = Math.floor(num/100).toString();
		    if(cents<10)
		    cents = "0" + cents;
		    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		    num = num.substring(0,num.length-(4*i+3))+','+
		    num.substring(num.length-(4*i+3));
		    return (((sign)?'':'-') + num + '.' + cents);
		}
	};
	window.lowerProDetail = lowerProDetail;
})(window);


