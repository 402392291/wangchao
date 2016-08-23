var Apply = {
	source : "",
	agentCode : "",
	productId : "",
	productName : "",
	circleId : "",
	circleCode : "",
	apply_count: 0,
	init : function () {
//		this.init_element();//页面元素初始化
	},
	//展示产品详情弹层
	product_detal : function(pId, obj, callback) {
		$.ajax({
			url : "/apply/product/introduce",
			data : {
				"pId" : pId
			},
			type : "GET", 
			dataType : "json",
			success : function(data){
				callback($(obj).attr("name-data"), data.result);
			}
		});
	},
	//申请开通直播
	apply : function (productId, productName, circleId, circleCode, agentCode, change) {
		if(!productId) {
			var dom = '<article class="alert_win">请选择产品！</article>';
			$('.content').append(dom);
			$('.alert_win').show();
			setTimeout(function(){
				$('.alert_win').remove();
			},3000);
			return;
		}
		//对点击事件解除绑定
		$("#agentApply").unbind("click");//输入代理商弹层的确认按钮
		$(".cpd_bottom_btn").unbind('click');//申请开通的确认按钮
		//通过计数控制重复提交的问题
		Apply.apply_count ++;
		if(Apply.apply_count > 1){
			return;
		}
		window.location.href = "/apply/paymethod?pId=" + productId
		+"&circleId=" + circleId 
		+ "&circleCode=" + circleCode  
		+ "&agCode=" +  agentCode
		+ "&change=" + change; 
//		$.ajax({
//			url : "/apply",
//			data : {
//				"productId" : productId,
//				"productName" : productName,
//				"circleId" : circleId,
//				"circleCode" : circleCode,
//				"agentCode" : agentCode,
//				"change" : change
//			},
//			type : "POST", 
//			dataType : "json",
//			success : function(data){
//				if(data.code == 0) {
//					//跳转到申请成功的页面
//					window.location.href = "/apply/success?productName=" 
//						+ data.result.productName + "&circleId=" + data.result.circleId;
//				} else {
//					window.location.href = "/apply/error";
//				}
//			}
//		});
	},
	//初始化产品信息
	init_product_list : function (callback) {
		var that = this;
		$.ajax({
			url : "/apply/product/list",
			data : {
				"circleId" : this.circleId,
			},
			type : "GET", 
			dataType : "json",
			success : function(data){
				if(data.code == 0) {
					callback(data.result);
				}
			}
		});
	},
	//根据来源初始化页面显示内容和绑定时间
	init_content : function () {
		//初始化内容
		if(Apply.source == "fromZX" || Apply.source == "fromCircle4Change" ) {
			$("#cirTitle, .d_czkh_list, #agTitle, .cpd_top").show();
		} else if(Apply.source == "fromCircle") {
			$(".top_cpd_js, .zx_xms_btn").show();
		}
		//初始化绑定和事件
		$(".cpd_bottom_btn").bind('click', function() {
			if(!Apply.productId) {
				var dom = '<article class="alert_win">请选择产品！</article>';
				$('.content').append(dom);
				$('.alert_win').show();
				setTimeout(function(){
					$('.alert_win').remove();
				},3000);
				return;
			}
			if(Apply.source == "fromZX") {
				Apply.apply(Apply.productId, Apply.productName, Apply.circleId, 
						Apply.circleCode, Apply.agentCode, "");
			} else if(Apply.source == "fromCircle4Change") {
				Apply.apply(Apply.productId, Apply.productName, Apply.circleId, 
						Apply.circleCode, Apply.agentCode, "change");
			} else {
				Apply.apply(Apply.productId, Apply.productName, Apply.circleId, 
						Apply.circleCode, "", "");
//				$("#gaiayAgentApply").bind('click', function(){
//					Apply.apply(Apply.productId, Apply.productName, Apply.circleId, 
//							Apply.circleCode, Apply.agentCode);
//				});
			}
		});	
	},
	//页面标签初始化
//	init_element : function () {
//		$('.win_kai a.cancel').bind('click', function() {
//			$('.backBg,.win_kai').hide();
//		});
//		$('.win_kai a.confirm').bind('click', function() {
//			$('.backBg,.win_kai').hide();
//		});
//		$(".xq_content_btn").bind("click", function(){
//			$("#xq_name").html("");
//			$("#xq_introduce").html("");
//			$(".backBg, .xq_content").hide();
//		});
//		$(".win_close_btn").bind("click", function(){
//			$(".backBg, .win_kai").hide();
//		});
//	},
	//初始化单选按钮
	init_radio : function () {
		$('.cpd_radio').bind('click', function() {
			if ($(this).hasClass('check-radios')) {
				$(this).removeClass('check-radios');
				Apply.productId = "";
				Apply.productName = "";
			} else {
				$('.cpd_radio').removeClass('check-radios');
				$(this).addClass('check-radios');
				Apply.productId = $(this).attr("id-data");
				Apply.productName = $(this).attr("name-data");
				
			}
		});
	}
};