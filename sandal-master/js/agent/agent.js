var Agent = {
	agentCode: "",
	circleId:"",
	init : function () {
		//初始化复制
		this.mg_copy();
	},
	//初始化代理商统计
	init_count : function (callback) {
		$.ajax({
			url : "/agent/customer/count",
			data : {
				"agentCode" : this.agentCode,
			},
			type : "GET", 
			dataType : "json",
			success : function(data){
				callback(data);
			}
		});
	},
	//初始化产品信息
	init_product : function (callback) {
		var that = this;
		$.ajax({
			url : "/agent/product",
			data : {
				"agentCode" : this.agentCode,
			},
			type : "GET", 
			dataType : "json",
			success : function(data){
				callback(data);
			}
		});
	},
	//根据精确查询获取社群详情
	get_circle_data : function (circleCode, callback) {
		var that = this;
		$.ajax({
			url : ctx + "/agent/customer/detail",
			data : {
				"circleCode" : circleCode,
			},
			type : "GET", 
			dataType : "json",
			success : function(data){
				if(data.code == 0) {
					callback(data.result);
				} else {
					var dom = '<article class="alert_win">该社群不存在！</article>';
					$('.content').append(dom);
					$('.alert_win').show();
					setTimeout(function(){
						$('.alert_win').remove();
					},3000);
					return;
				}
			}
		});
	},
	//复制按钮功能初始化
	mg_copy : function() {
		var clipboard = new Clipboard('.mg_copy');
		clipboard.on('success', function(e) {			
			$('.alert_win').show();
			setTimeout(function(){
				$('.alert_win').hide();
			},2000);
		});
		clipboard.on('error', function(e) {
			console.log(e);
		});
	}
};