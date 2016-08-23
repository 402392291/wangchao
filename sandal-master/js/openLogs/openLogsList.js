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
		productId:'',//产品ID
		/**
		*  页面初始化加载
		**/
		onLoad:function(){
			this.allTypeData();
			this.loaded();
			this.loadRecordData();	
		},
		/**
		 * 全部类型列表数据
		 */
		allTypeData:function(){
			var url =  '/openLogs/productList?agentCode='+ agentCode;
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
			var html = '';
			var count = 0;
			if(data.result.length > 0){
				for (var i = 0; i < data.result.length; i++) {
					html += '<li class="select_li" data-productId="'+data.result[i].productId+'"><span class="oneline_text">'+data.result[i].productName+'('+data.result[i].count+')'+'</span></li>';
					count += data.result[i].count;
				}
				
				var htmlOne = '<li class="select_li active" data-productId=""><span class="oneline_text">全部类型('+count+')</span></li>';
				var all = '<span class="oneline_text">全部类型('+count+')</span>';
				$('.screenNav_li').html(all);
				$('.allType_li').append(htmlOne);
				$('.allType_li').append(html);
				this.allTypeSearch();
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
		 * 根据全部直播号类型筛选
		 */
		allTypeSearch:function(){
			$(".allType_li .select_li").click(function() {
				var $this = $(this);
				var index = $(".allType_li .select_li").index(this);
				hasOpenList.pageNo = 1;
				hasOpenList.productId = $(this).attr('data-productId');
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
			var url = '/openLogs/list?pageSize='+hasOpenList.pageSize+"&pageNo="+hasOpenList.pageNo+'&agentCode='+agentCode+'&productId='+hasOpenList.typeOfValue(hasOpenList.productId);
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
						if(obj.productName != null){
							dom += '<p class="oneline_text circleN">'+obj.productName+'</p>';
						}
						if(obj.circleName != null){
							dom += '<p class="oneline_text productN">社群：'+obj.circleName+'</p>';
						}
						if(obj.openTime != 0){
							dom += '<span>开通：'+new Date(obj.openTime).format("yyyy-MM-dd")+'</span>';
						}
						if(obj.expireTime != 0){
							dom += '<span>到期：'+new Date(obj.expireTime).format("yyyy-MM-dd")+'</span>';
						}
						dom += '</div>';
						dom += '<div class="sale_num">';
						if(obj.chargeStatus == 2){
							dom += '<span>已付费</span>';
						}else if(obj.chargeStatus == 1){
							dom += '<span class="remark">未付费</span>';
						}
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


