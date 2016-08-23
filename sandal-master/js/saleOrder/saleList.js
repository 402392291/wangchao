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
		chargeState:'',//付费状态
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
			this.allTypeSearch();
			this.ruleClick();
		},
		/**
		 * 绑定问号点击事件弹出框
		 */
		ruleClick:function(){
			$('#devDistributor').bind('click',function(){
				$('#backBg,.rule_book').show();
			});
			$('#rogerBtn').bind('click',function(){
				$('#backBg,.rule_book').hide();
			});
		},
		/**
		 * 全部类型列表数据
		 */
		allTypeData:function(){
			var url =  '/saleTotal/get?agentCode='+ agentCode;
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
			$('.dis_commission').text(data.result.saleTotal);
			$('#received').text(data.result.profitTotal);
			$('#uncollected').text(data.result.rsTotal);
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
		 * 根据全部直播号类型筛选
		 */
		allTypeSearch:function(){
			$(".allType_li .select_li").click(function() {
				var $this = $(this);
				var index = $(".allType_li .select_li").index(this);
				hasOpenList.pageNo = 1;
				if(index == 0){
					hasOpenList.chargeState = '';
				}else if(index == 1){
					hasOpenList.chargeState = 2;
				}else if(index == 2){
					hasOpenList.chargeState = 1;
				}
				var text = $this.find('span').text();
				$(".screenNav_li").eq(0).find('span').html(text);
				hasOpenList.loadRecordData();
				$(this).siblings('.select_li').removeClass('active');
				$this.addClass("active");
				$this.parent("ul").hide();
			});
		},
		/**
		 * 加载已开通直播号列表数据
		 */
		loadRecordData:function(){
			var url = '/saleOrder/list?pageSize='+hasOpenList.pageSize+"&pageNo="+hasOpenList.pageNo+'&status='+hasOpenList.chargeState+'&agentCode='+agentCode;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {	
					if(data.code == 0){
						var length = data.result.result!= undefined ? data.result.result.length : 0;
						if (length == hasOpenList.pageSize) {
							$("#pullUp").show();
						}
						hasOpenList.currentCount = length;
						hasOpenList.getGroupBillListDom(data);
						hasOpenList.myScroll.refresh();
					}
				}
		    });
		},
		/**
		 * 点击查看销售详情
		 */
		clickLookDetails:function(){
			$('#content dl').bind('click',function(){
				var id = $(this).attr('data-id');
				window.location.href = 'details.html?id='+id;
			});
		},
		/**
		* 获取已开通直播号列表页面Dom
		**/
		getGroupBillListDom:function(data){
			$(".load").hide();
			var dom = '';
			var groupBillcont =  $("#"+ window.hasOpenList.contentId);
			if(data.code == 0){
				var datas = data.result.result;
				if(datas.length == 0 && $("#hasOpen_list").attr("pageNo")=='1'){
					groupBillcont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
				}else{
					if(hasOpenList.pageNo == 1){
						groupBillcont.html("");
					}
					for (var int = 0; int < datas.length; int++) {
						var obj = datas[int];
						dom += '<dl class="pubFlex dl" data-id="'+obj.id+'">';
						dom += '<dd class="autoFlex pubFlex" style="width:80%;">';
						dom += '<div class="autoFlex" style="width:80%;">';
						dom += '<p class="oneline_text circleN">'+obj.productName+'</p>';
						dom += '<p class="oneline_text productN">社群：'+obj.circleName+'</p>';
						if(obj.openTime != 0){
							dom += '<span>'+new Date(obj.openTime).format("yyyy-MM-dd HH:mm")+'</span>';
						}
						dom += '</div>';
						dom += '<div class="sale_num">';
						if(obj.chargeStatus == 2){
							dom += '<span>已付费</span>';
						}else if(obj.chargeStatus == 1){
							dom += '<span>未付费</span>';
						}
						dom += '<p>'+obj.price+'</p>';
						dom += '</div>';
						dom += '</dd>';
						dom += '</dl>';
					}
					dom += '<p class="marginBottom"></p>';
					groupBillcont.append(dom);
					hasOpenList.clickLookDetails();
				}
			}else{
				groupBillcont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
			}
			return dom;
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


