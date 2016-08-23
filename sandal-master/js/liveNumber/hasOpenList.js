/**
 * 已开通直播号列表页面的列表加载
 */
(function(window){
	window.hasOpenList = {
		myScroll:"",//页面滚动条流
		pullDownEl:"", //向下滚动Doc对象
		pullDownOffset:"",
		pullUpEl:"", //向上滚动Doc对象
		pullUpOffset:"",
		currentCount:0,
		pageNo:1, //当前第几页
		pageSize:15,  //一页查询数据量
		scrollListId:"hasOpen_list", //加滚动条的divId
		contentId:"content",//加列表内容的divID
		chargeState:0,//付费状态
		circleName:'',//社群名
		state:0,//使用状态
		productId:0,//产品ID
		/**
		*  页面初始化加载
		**/
		onLoad:function(){
			this.allTypeData();
			this.loaded();
			this.loadRecordData();
			this.searchClick();
			this.screenSearch();
			this.screenStateSearch();
		},
		/**
		 * 全部类型列表数据
		 */
		allTypeData:function(){
			var url =  '/api/agent/product/list?agentCode='+ agentCode;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {
					if(data.code == 0){
						hasOpenList.allTypeDom(data);
					}
				}
		    });
		},
		/**
		 * 全部类型列表Dom
		 */
		allTypeDom:function(data){
			var dom = '';
			var datas = data.result;
			for(var int = 0; int < datas.length; int++){
				var obj = datas[int];
				var productId = obj.pId;
				dom += '<li class="select_li" id="select_'+productId+'">';
				dom += '<span class="oneline_text">'+obj.pName+'</span>';
				dom += '</li>';
				$(".allType_li").append(dom);
				hasOpenList.allTypeSearch(productId);
				dom = '';
			}
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
		 * 搜索方法
		 */
		searchClick:function(){
			$('.search_cancle').on("click",function(){
				if($("#keyword").val() == ''){
					$(".search_img").show();
				}else if($("#keyword").val() != ''){
					hasOpenList.circleName = $("#keyword").val();
					hasOpenList.pageNo=1;
					hasOpenList.currentCount=0;
					$("#"+ window.hasOpenList.contentId).html('<p class="load"><img src="/statics/images/loading.gif"/></p>');
					hasOpenList.loadRecordData();
				}
			});
		},
		/**
		 * 根据全部直播号类型筛选
		 */
		allTypeSearch:function(productId){
			$(".allType_li .select_li:first-child,#select_"+productId).click(function() {
				var $this = $(this);
				var index = $(this).index();
				var text = $this.find('span').text();
				$(".allType span").html(text);
				$(this).siblings('.select_li').removeClass('active');
				$this.addClass("active");
				$this.parent("ul").hide();
				$(".allType span").css("margin-left",-$(".allType span").width()/100+'rem');
				if(index == 0){
					hasOpenList.productId = 0;
				}else{
					hasOpenList.productId = productId;
				}
				hasOpenList.pageNo=1;
				hasOpenList.currentCount=0;
				$("#"+ window.hasOpenList.contentId).html('<p class="load"><img src="/statics/images/loading.gif"/></p>');
				hasOpenList.loadRecordData();
			});
		},
		/**
		 * 根据付费状态筛选查询
		 */
		screenSearch:function(){
			$(".payment_li .select_li").click(function() {
				var $this = $(this);
				var index = $(this).index();
				hasOpenList.chargeState = index;
				var text = $this.text();
				$(".paymentSuit span").html(text);
				$(this).siblings('.select_li').removeClass('active');
				$this.addClass("active");
				$this.parent("ul").hide();
				$(".paymentSuit span").css("margin-left",-$(".paymentSuit span").width()/100+'rem');
				hasOpenList.pageNo=1;
				hasOpenList.currentCount=0;
				$("#"+ window.hasOpenList.contentId).html('<p class="load"><img src="/statics/images/loading.gif"/></p>');
				hasOpenList.loadRecordData();
			});
		},
		/**
		 * 根据使用状态来筛选列表
		 */
		screenStateSearch:function(){
			$(".allState_li .select_li").click(function() {				
				var $this = $(this);
				var index = $(this).index();
				if(index == 0){
					hasOpenList.state = 0;
				}else if(index == 1){
					hasOpenList.state = 3;
				}else if(index == 2){
					hasOpenList.state = 4;
				}else if(index == 3){
					hasOpenList.state = 6;
				}else if(index == 4){
					hasOpenList.state = 7;
				}
				var text = $this.text();
				$(".allState span").html(text);
				hasOpenList.pageNo=1;
				hasOpenList.currentCount=0;
				$("#pullUp").hide();
				$("#"+ window.hasOpenList.contentId).html('<p class="load"><img src="/statics/images/loading.gif"/></p>');
				hasOpenList.loadRecordData();
				$(this).siblings('.select_li').removeClass('active');
				$this.addClass("active");
				$this.parent("ul").hide();
				$(".allState span").css("margin-left",-$(".allState span").width()/100+'rem');
			});
		},
		/**
		 * 加载已开通直播号列表数据
		 */
		loadRecordData:function(){
			var url = '/custom/list/opend/'+agentCode+'?pageSize='+hasOpenList.pageSize+"&pageNo="+hasOpenList.pageNo+"&userId="+userId
					+'&chargeStatus='+hasOpenList.chargeState+'&circleName='+hasOpenList.circleName+'&state='+hasOpenList.state
					+'&productId='+hasOpenList.productId;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {	
					var length = data.result!= undefined ? data.result.length : 0;
					if (length == hasOpenList.pageSize) {
						$("#pullUp").show();
					}
					hasOpenList.currentCount = length;
					hasOpenList.getGroupBillListDom(data);
					$("#hasOpen_list").css({"top":"1.56rem"});
					hasOpenList.myScroll.refresh();
				}
		    });
		},
		/**
		* 获取已开通直播号列表页面Dom
		**/
		getGroupBillListDom:function(data){
			$(".load").hide();
			var dom = '';
			var hasOpencont =  $("#"+ window.hasOpenList.contentId);
			if(data.code == 0){
				var datas = data.result;
				if(datas.length == 0 && $("#hasOpen_list").attr("pageNo")=='1'){
					hasOpencont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
				}else{
					if(hasOpenList.pageNo == 1){
						hasOpencont.html("");
					}
					for (var int = 0; int < datas.length; int++) {
						var obj = datas[int];
						dom += '<dl class="pubFlex dl" onclick="hasOpenList.gotoDetail(\''+
								obj.customerId+'\', \''+ obj.circleId+'\',\''+obj.productId+'\');">';
						dom += '<dt><img src="'+ obj.circleLogo +'" />';
						dom += '</dt>';
						dom += '<dd class="autoFlex pubFlex">';
						dom += '<div class="autoFlex">';
						dom += '<p class="oneline_text circleN">'+obj.circleName+'</p>';
						dom += '<p class="oneline_text productN">'+obj.productName+'</p>';
						dom += '<span>开通：'+new Date(parseInt(obj.openTime)).format("yyyy-MM-dd")+'</span>';
						dom += '<span>到期：'+new Date(parseInt(obj.expireTime)).format("yyyy-MM-dd")+'</span>';
						dom += '</div>';
						if(obj.chargeState == 2){
							dom += '<span>已付费</span>';
						}else if(obj.chargeState == 1){
							dom += '<span style="color:#ff2d2d">未付费</span>';
						}
						dom += '</dd>';
						dom += '</dl>';
					}
					hasOpencont.append(dom);
					if(hasOpenList.pageNo == 1){
						$(".marginBottom").css({"height":'0.6rem'});
					}
				}
			}else{
				hasOpencont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
			}
			return dom;
		},
		/**
		 * 已开通直播号列表跳转链接
		 * @param id
		 */
		gotoDetail:function(applyId, circleId, productId){
			window.location.href = ctx+"custom/"+circleId
			+"/info?agCode="+agentCode+"&productId="+productId
			+"&type="+2+"&applyId="+ applyId;
		},
		/**
		 * 上拉刷新
		 */
		pullUpAction:function() {
			var currentCount = hasOpenList.currentCount;
			var pageSize = hasOpenList.pageSize;
			if((currentCount > 0) && ( currentCount == pageSize)){
				setTimeout(function () {
					hasOpenList.pageNo++;
					$("#hasOpen_list").attr("pageNo",hasOpenList.pageNo);
					hasOpenList.loadRecordData();
					hasOpenList.myScroll.refresh();
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
		loaded:function() {
			hasOpenList.pullUpEl =  document.getElementById('pullUp');
			hasOpenList.pullUpOffset = hasOpenList.pullUpEl.offsetHeight;
			hasOpenList.myScroll = new iScroll(hasOpenList.scrollListId, {
				useTransition: true,
				topOffset: hasOpenList.pullDownOffset,
				onRefresh: function () {
					if (hasOpenList.pullUpEl.className.match('loading')) {
						hasOpenList.pullUpEl.className = '';
						hasOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载...';
					}
				},
				onScrollMove: function () {
					if (this.y < (this.maxScrollY - 5) && !hasOpenList.pullUpEl.className.match('flip')) {
						hasOpenList.pullUpEl.className = 'flip';
						hasOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开刷新...';
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 5) && hasOpenList.pullUpEl.className.match('flip')) {
						hasOpenList.pullUpEl.className = '';
						hasOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉刷新...';
						this.maxScrollY = hasOpenList.pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (hasOpenList.pullUpEl.className.match('flip')) {
						hasOpenList.pullUpEl.className = 'loading';
						hasOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
						hasOpenList.pullUpAction();	// Execute custom function (ajax call?)
					}
				}
			});
			setTimeout(function () { document.getElementById('hasOpen_list').style.left = '0'; }, 800);
		},
	};
	window.hasOpenList = hasOpenList;
})(window);


