/**
 * user lixiaohe
 * use 待开通质保号列表
 * createTime 2016-8-9
 */
(function(window){
	window.toBeOpenList = {
			myScroll:"",//页面滚动条流
			pullDownEl:"", //向下滚动Doc对象
			pullDownOffset:"",
			pullUpEl:"", //向上滚动Doc对象
			pullUpOffset:"",
			currentCount:0,
			pageNo:1, //当前第几页
			pageSize:15,  //一页查询数据量
			scrollListId:"toBeOpen_list", //加滚动条的divId
			contentId:"content",//加列表内容的divID
			applyId:'',
			circleId:'',
		/**
		 * 初始化待开通列表页面的方法
		 */
		onLoad:function(){
			this.loaded();
			this.loadRecordData();
		},
		/**
		 * 加载待开通直播号列表数据
		 */
		loadRecordData:function(){
			var url = '/custom/list/apply/'+agentCode+'?pageSize='+toBeOpenList.pageSize+"&pageNo="+toBeOpenList.pageNo+"&userId="+userId;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {	
					var length = data.result!= undefined ? data.result.length : 0;
					if (length == toBeOpenList.pageSize) {
						$("#pullUp").show();
					}
					toBeOpenList.currentCount = length;
					toBeOpenList.getGroupBillListDom(data);
					toBeOpenList.myScroll.refresh();
				}
		    });
		},
		/**
		* 获取待开通直播号列表页面Dom
		**/
		getGroupBillListDom:function(data){
			$(".load").hide();
			var dom = '';
			var toBeOpencont =  $("#"+ window.toBeOpenList.contentId);
			if(data.code == 0){
				var datas = data.result;
				if(datas.length == 0 && $("#toBeOpen_list").attr("pageNo")=='1'){
					toBeOpencont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
				}else{
					if(toBeOpenList.pageNo == 1){
						toBeOpencont.html("");
					}
					for (var int = 0; int < datas.length; int++) {
						var obj = datas[int];
						//返回数据和已开通列表公用返回对象，customerId即applyId
						dom += '<dl class="pubFlex dl" onclick="toBeOpenList.gotoDetail(\''+
							obj.customerId+'\', \''+ obj.circleId+'\',\''+obj.productId+'\');">';
						dom += '<dt class="autoFlex">';
						dom += '<p class="oneline_text circleN">申请开通：'+obj.productName+'</p>';
						dom += '<p class="oneline_text productN">社群：'+obj.circleName+'</p>';
						dom += '<span>'+new Date(parseInt(obj.openTime)).format("yyyy-MM-dd HH:mm")+'</span>';
						dom += '</dt>';
						dom += '<dd>';
						dom += '</dd>';
						dom += '</dl>';
					}
					toBeOpencont.append(dom);
				}
			}else{
				toBeOpencont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
			}
			return dom;
		},
		/**
		 * 待开通直播号列表跳转链接
		 * @param id
		 */
		gotoDetail:function(applyId, circleId, productId){
			window.location.href = ctx+"custom/"+circleId
				+"/info?agCode="+agentCode+"&productId="+productId
				+"&type="+1+"&applyId="+ applyId;
		},
		/**
		 * 上拉刷新
		 */
		pullUpAction:function() {
			var currentCount = toBeOpenList.currentCount;
			var pageSize = toBeOpenList.pageSize;
			if((currentCount > 0) && ( currentCount == pageSize)){
				setTimeout(function () {
					toBeOpenList.pageNo++;
					$("#toBeOpen_list").attr("pageNo",toBeOpenList.pageNo);
					toBeOpenList.loadRecordData();
					toBeOpenList.myScroll.refresh();
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
			toBeOpenList.pullUpEl =  document.getElementById('pullUp');
			toBeOpenList.pullUpOffset = toBeOpenList.pullUpEl.offsetHeight;
			toBeOpenList.myScroll = new iScroll(toBeOpenList.scrollListId, {
				useTransition: true,
				topOffset: toBeOpenList.pullDownOffset,
				onRefresh: function () {
					if (toBeOpenList.pullUpEl.className.match('loading')) {
						toBeOpenList.pullUpEl.className = '';
						toBeOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载...';
					}
				},
				onScrollMove: function () {
					if (this.y < (this.maxScrollY - 5) && !toBeOpenList.pullUpEl.className.match('flip')) {
						toBeOpenList.pullUpEl.className = 'flip';
						toBeOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开刷新...';
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 5) && toBeOpenList.pullUpEl.className.match('flip')) {
						toBeOpenList.pullUpEl.className = '';
						toBeOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉刷新...';
						this.maxScrollY = toBeOpenList.pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (toBeOpenList.pullUpEl.className.match('flip')) {
						toBeOpenList.pullUpEl.className = 'loading';
						toBeOpenList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
						toBeOpenList.pullUpAction();	// Execute custom function (ajax call?)
					}
				}
			});
			setTimeout(function () { document.getElementById('toBeOpen_list').style.left = '0'; }, 800);
		},
	};
	window.toBeOpenList = toBeOpenList;
})(window);