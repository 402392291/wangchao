(function(window){
	window.agentIndex = {
		/**
		 * 获取分润金额
		 */
		getProfitData:function(agentCode){
			$.ajax({
				url :"/agent/index/statistics/" + agentCode,
				type : "GET", 
				dataType : "json",
				success : function(data){
					if(data.code == 0){
						$(".traffic_profitSum").text(agentIndex.formatCurrency(data.result.myPromotion));//我的分润
						$(".traffic_salesSum").text(agentIndex.formatCurrency(data.result.saleStatictics));//总销售额
						$(".traffic_unSales").text(agentIndex.formatCurrency(data.result.nonPayStatistics));//未收费金额
						$("#trafficItem_hasOpen").text(data.result.hasOpenStatistics);//已开通直播号统计
						$("#promiter").text(data.result.promoterStatistics);//推广者统计
						$("#lowerBusinessHall").text(data.result.lowerAgent);//推广者统计
					}
				}
			});
		},
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
	window.agentIndex = agentIndex;
})(window);