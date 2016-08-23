/**
 * 群账单列表的滚动条添加
 */
(function(window){
	window.promProfitList = {
		myScroll:"",//页面滚动条流
		pullDownEl:"", //向下滚动Doc对象
		pullDownOffset:"",
		pullUpEl:"", //向上滚动Doc对象
		pullUpOffset:"",
		currentCount:0,
		agentCode : "",
		role:'',
		pageNo:1, //当前第几页
		pageSize:15,  //一页查询数据量
		scrollListId:"promProfit_list", //加滚动条的divId
		contentId:"content",//加列表内容的divID
		/**
		*  页面初始化加载
		**/
		onLoad:function(){
			var agentCode = CommonOper.getQueryStringS("agentCode");
			var role = CommonOper.getQueryStringS("role");
			var userId = CommonOper.getQueryStringS("userId");
			window.promProfitList.agentCode = agentCode;
			window.promProfitList.role = role;
			window.promProfitList.userId = userId;
			if(role == 1){
				$("#promProfit_list").css({"top":"4.21rem"});
			}else if(role == 2){
				$("#promProfit_list").css({"top":"3.16rem"});
				$(".borderDotted").hide();
			}
			this.loaded(agentCode,role);
			if(role == 1){
				this.loadTotal(agentCode);
				this.loadGroupBillData(agentCode,role);
			}else if(role == 2){
				this.loadPromTotal(userId);
				this.loadPromfitData(userId,role);
			}
			this.profitBox(role);
		},
		/**
		 * 分润介绍弹框的dom
		 */
		profitBox:function(role){
			var dom = '';
			if(role == 1){
				dom += '<section class="promfit_Statistics">';
				dom += '<p class="promfit_total">';
				dom += '<span>销售分润</span>';
				dom += '<strong id="earning">0</strong>';
				dom += '</p>';
				dom += '<p class="promfit_total">';
				dom += '<span>营业厅分润</span>';
				dom += '<strong id="expense">0</strong>';
				dom += '</p>';
				dom += '</section>';
			}
			dom += '<div class="promProfitBox">';
			dom += '<article>';
			dom += '<section>';
			dom += '<h2>分润规则说明</h2>';
			if(role == 1){
				dom += '<p>1、只有已付费的订单才会进行分润。 </p>';
				dom += '<p>2、选择线下支付的，营业厅需将销售金额交付 给掌门后，由掌门确认后才会进行分润。 </p>';
				dom += '<p>3、销售分润是指开通直播号获得的分润。</p>';
				dom += '<p> 4、营业厅分润是指由下级营业厅贡献的分润。</p>';
			}else if(role == 2){
				dom += '<p>1、分润只有在直播号开通后才记录。 </p>';
				dom += '<p>2、购买直播号时选择线上支付时所获得的分润会自动入账。 </p>';
				dom += '<p>3、购买直播号时选择线下适度暂时无法进行分润，待掌门收到款后会自动进行分润。</p>';
			}
			dom += '<a class="mywalletClose" onclick=\'$(".promProfitBox").hide();\'>我知道了</a>';
			dom += '</section>';
			dom += '</article>';
			dom += '</div>';
			dom += '<h1 class="promProfit_name">分润明细</h1>';
			$(".promProfitHead").append(dom);
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
		 * 获取营业厅统计信息
		 */		
		loadTotal:function(agentCode,role){
			var url = '/earning/agent/'+agentCode;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data) {					
					if (data.code == 0){
						$("#income").text(data.result.sumEarning);
						$("#expense").text(data.result.fEarning);
						$("#earning").text(data.result.aEarning);
					}
				}
		    });			
		},
		/**
		 * 获取推广者的统计信息
		 */
		loadPromTotal:function(userId){
			var url = '/earning/promoter/'+userId;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data) {					
					if (data.code == 0){
						$("#income").text(data.result);
					}
				}
		    });		
		},
		/**
		 * 加载商品管理列表数据
		 */
		loadGroupBillData:function(agentCode,role){
			var url = '/earning/agent/list/'+agentCode+'?pageSize='+promProfitList.pageSize
				+"&pageNo="+promProfitList.pageNo;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {					
					var length = data.result != undefined ? data.result.length : 0;
					if (length == promProfitList.pageSize) {
						$("#pullUp").show();
					}
					promProfitList.currentCount = length;
					window.promProfitList.getGroupBillListDom(data,role);
					promProfitList.myScroll.refresh();
				}
		    });
		},
		/**
		 * 加载推广者分润列表数据
		 */
		loadPromfitData:function(userId,role){
			var url = '/earning/promoter/list/'+userId+'?pageSize='+promProfitList.pageSize
				+"&pageNo="+promProfitList.pageNo;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {					
					var length = data.result != undefined ? data.result.length : 0;
					if (length == promProfitList.pageSize) {
						$("#pullUp").show();
					}
					promProfitList.currentCount = length;
					window.promProfitList.getGroupBillListDom(data,role);
					promProfitList.myScroll.refresh();
				}
		    });
		},
		/**
		* 获取我的分润列表
		**/
		getGroupBillListDom:function(data,role){
			$(".load").hide();
			var dom = '';
			var promProfitcont =  $("#"+ window.promProfitList.contentId);
			if(data.code == 0){
				var datas = data.result;
				if(datas.length == 0 && $("#promProfit_list").attr("pageNo")=='1'){
					promProfitcont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
				}else{
					if(promProfitList.pageNo == 1){
						promProfitcont.html("");
					}
					for (var int = 0; int < datas.length ; int++) {
						var obj = datas[int];
						dom += '<dl class="promProfitItem" onclick="promProfitList.gotoDetail(\''+
						obj.id+'\', \''+ obj.followerId+'\',\''+role+
						'\');">';
						dom += '<dt><h3>'+obj.orderName+'</h3>';
						dom += '<span>已收</span>';
						dom += '</dt>';
						dom += '<dd>';
					//	dom += '<var>'+(new Date(obj.time)).format("yyyy-MM-dd HH:mm:ss")+'</var>';
						var orderPrice = 0.00;
						if(obj.price != null){
							orderPrice = obj.price;
						}
						orderPrice = promProfitList.toDecimal2(orderPrice);
						if(!orderPrice){
							orderPrice = obj.orderPrice;
						}
						dom += '<i>'+orderPrice+'</i>';
						dom += '</dd>';
						dom += '</dl>';
					}
					promProfitcont.append(dom);
				}
			}else{
				promProfitcont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
			}
			return dom;
		},
		/**
		 * 我的分润列表跳转链接
		 * @param id
		 */
		gotoDetail:function(sfoId,userId,role){
			window.location.href = "/statics/html/promotion/promProfitDetails.html?sfoId="+sfoId+
			'&userId='+userId+'&identity='+role;
		},
		/**
		 * 制保留2位小数，如：2，会在2后面补上00.即2.00   
		 * @param x
		 * @returns
		 */
		toDecimal2:function(x) {    
		    var f = parseFloat(x);    //parseFloat(orderPrice.toFixed(2))
		    if (isNaN(f)) {    
		        return false;    
		    }    
		    var f = Math.round(x*100)/100;    
		    var s = f.toString();    
		    var rs = s.indexOf('.');    
		    if (rs < 0) {    
		        rs = s.length;    
		        s += '.';    
		    }    
		    while (s.length <= rs + 2) {    
		        s += '0';    
		    }    
		    return s;    
		},
		/**
		 * 下拉刷新
		 */
		pullDownAction:function(agentCode,role,userId) {
			//console.log("下拉刷新");
			setTimeout(function () {// Simulate network congestion, remove setTimeout from production!
				promProfitList.pageNo = 1;
				promProfitList.currentCount = 0;
				$("#promProfit_list").attr("count",0);
				$("#promProfit_list").attr("pageNo",1);
				$("#promProfit_list").attr("pageSize",0);
				promProfitList.loadTotal();
				if(role == 1){
					promProfitList.loadGroupBillData(agentCode,role);
				}else if(role==2){
					promProfitList.loadPromfitData(userId,role);
				}
				$("#pullDown").hide();
				$("#pullUp").find(".pullUpLabel").text("上拉加载");
				$("#pullUp").find(".pullUpIcon").show();
			}, 1000);	// Simulate network congestion, remove setTimeout from production!
		},
		/**
		 * 上拉刷新
		 */
		pullUpAction:function(agentCode,role,userId) {
			var currentCount = promProfitList.currentCount;
			var pageSize = promProfitList.pageSize;
			if((currentCount > 0) && ( currentCount == pageSize)){
				setTimeout(function () {
					promProfitList.pageNo++;
					$("#promProfit_list").attr("pageNo",promProfitList.pageNo);
					if(role == 1){
						promProfitList.loadGroupBillData(agentCode);
					}else if(role==2){
						promProfitList.loadPromfitData(userId);
					}
					promProfitList.myScroll.refresh();
				}, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
				$("#pullUp").show();
			} else {
				$("#pullUp").find(".pullUpIcon").hide();
				$("#pullUp").find(".pullUpLabel").text("没有了");
			}
		},
		/**
		 * 加载页面滚动条
		 */
		loaded:function(agentCode,role,userId) {
			promProfitList.pullDownEl = document.getElementById('pullDown');
			promProfitList.pullDownOffset = promProfitList.pullDownEl.offsetHeight;
			promProfitList.pullUpEl =  document.getElementById('pullUp');
			promProfitList.pullUpOffset = promProfitList.pullUpEl.offsetHeight;
			promProfitList.myScroll = new iScroll(promProfitList.scrollListId, {
				useTransition: true,
				topOffset: promProfitList.pullDownOffset,
				onRefresh: function () {
					if (promProfitList.pullDownEl.className.match('loading')) {
						promProfitList.pullDownEl.className = '';
						promProfitList.pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
					} else if (promProfitList.pullUpEl.className.match('loading')) {
						promProfitList.pullUpEl.className = '';
						promProfitList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载...';
					}
				},
				onScrollMove: function () {
					if (this.y > 5 && !promProfitList.pullDownEl.className.match('flip')) {
						$("#pullDown").slideDown();
						promProfitList.pullDownEl.className = 'flip';
						promProfitList.pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开刷新...';
						this.minScrollY = 0;
					} else if (this.y < 5 && promProfitList.pullDownEl.className.match('flip')) {
						promProfitList.pullDownEl.className = '';
						promProfitList.pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
						this.minScrollY = -promProfitList.pullDownOffset;
					} else if (this.y < (this.maxScrollY - 5) && !promProfitList.pullUpEl.className.match('flip')) {
						promProfitList.pullUpEl.className = 'flip';
						promProfitList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开刷新...';
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 5) && promProfitList.pullUpEl.className.match('flip')) {
						promProfitList.pullUpEl.className = '';
						promProfitList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉刷新...';
						this.maxScrollY = promProfitList.pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (promProfitList.pullDownEl.className.match('flip')) {
						promProfitList.pullDownEl.className = 'loading';
						promProfitList.pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
						promProfitList.pullDownAction(window.promProfitList.agentCode,
						window.promProfitList.role,window.promProfitList.userId);	// Execute custom function (ajax call?)
					} else if (promProfitList.pullUpEl.className.match('flip')) {
						promProfitList.pullUpEl.className = 'loading';
						promProfitList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
						promProfitList.pullUpAction(window.promProfitList.agentCode,
						window.promProfitList.role,window.promProfitList.userId);	// Execute custom function (ajax call?)
					}
				}
			});
			setTimeout(function () { document.getElementById('promProfit_list').style.left = '0'; }, 800);
		},
	};
	window.promProfitList = promProfitList;
})(window);
