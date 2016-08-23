/**
 * 推广者列表页面的列表加载
 */
(function(window){
	window.lowerPromList = {
		myScroll:"",//页面滚动条流
		pullDownEl:"", //向下滚动Doc对象
		pullDownOffset:"",
		pullUpEl:"", //向上滚动Doc对象
		pullUpOffset:"",
		currentCount:0,
		pageNo:1, //当前第几页
		pageSize:15,  //一页查询数据量
		scrollListId:"lowerProm_list", //加滚动条的divId
		contentId:"content",//加列表内容的divID
		chargeState:0,//付费状态
		circleName:'',//社群名
		state:0,//使用状态
		productId:0,//产品ID
		role:'',
		/**
		*  页面初始化加载
		**/
		onLoad:function(){
			var agentCode = CommonOper.getQueryStringS('agentCode');
			this.loaded();
			this.lowerPromterData(agentCode);
//			this.searchClick();
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
					lowerPromList.circleName = $("#keyword").val();
					lowerPromList.pageNo=1;
					lowerPromList.currentCount=0;
					$("#"+ window.lowerPromList.contentId).html('');
					lowerPromList.lowerPromterData();
				}
			});
		},
		/**
		 * 加载推广者列表数据
		 */
		lowerPromterData:function(agentCode){
			var url = '/follower/list?agentCode='+agentCode+'&pageSize='+lowerPromList.pageSize+"&pageNo="+lowerPromList.pageNo;
			$.ajax({
				type: "GET",
				url: url,
				dataType:"json",
				success: function(data, textStatus) {	
					var length = data.result.result!= undefined ? data.result.result.length : 0;
					if (length == lowerPromList.pageSize) {
						$("#pullUp").show();
					}
					lowerPromList.currentCount = length;
					lowerPromList.getlowerPromListDom(data,agentCode);
					lowerPromList.myScroll.refresh();
				}
		    });
		},
		/**
		* 获取推广者列表页面Dom
		**/
		getlowerPromListDom:function(data,agentCode){
			$(".load").hide();
			var dom = '';
			var lowerPromcont =  $("#"+ window.lowerPromList.contentId);
			if(data.code == 0){
				var datas = data.result.result;
				if(datas.length == 0 && $("#lowerProm_list").attr("pageNo")=='1'){
					lowerPromcont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
				}else{
					if(lowerPromList.pageNo == 1){
						lowerPromcont.html("");
					}
					for (var int = 0; int < datas.length; int++) {
						var obj = datas[int];
						dom += '<dl class="pubFlex spreadList" onclick="lowerPromList.gotoDetail(\''+
							obj.userId+'\',\''+ agentCode+'\');">';
						var pic = lowerPromList.typeOfValue(obj.userLogo);
						if(pic == ''){
							pic = '/statics/images/promotion/headPic.png';
						}
						dom += '<dt><img src="'+ pic +'" />';
						dom += '</dt>';
						dom += '<dd class="autoFlex">';
						dom += '<h2 class="oneline_text">'+obj.userName+'</h2>';
						lowerPromList.role = CommonOper.getQueryStringS("role");
						if(lowerPromList.role == 1){
							dom += '<p class="oneline_text">直接销售额：'+lowerPromList.formatCurrency(obj.sealRoom)+'</p>';
						}else if(lowerPromList.role == 2){
							dom += '<p class="oneline_text">直接销售额：'+lowerPromList.formatCurrency(obj.sealRoom)+'</p>';
						}
						dom += '</dd>';
						dom += '</dl>';
					}
					lowerPromcont.append(dom);
				}
			}else{
				lowerPromcont.html('<section class="listNoCont" id="contentNo"><img src="/statics/images/listNoCont.png" class="listNoCont_img"/><h3 class="listNoCont_tit">暂无数据</h3></section>');
			}
			return dom;
		},
		/**
		 * 推广者列表跳转链接
		 * @param id
		 */
		gotoDetail:function(userId,agentCode){
			window.location.href = '/statics/html/lower/lowerPromDetails.html?agentCode='+agentCode+'&userId='+userId;
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
		},
		/**
		 * 上拉刷新
		 */
		pullUpAction:function() {
			var currentCount = lowerPromList.currentCount;
			var pageSize = lowerPromList.pageSize;
			if((currentCount > 0) && ( currentCount == pageSize)){
				setTimeout(function () {
					lowerPromList.pageNo++;
					$("#lowerProm_list").attr("pageNo",lowerPromList.pageNo);
					lowerPromList.lowerPromterData();
					lowerPromList.myScroll.refresh();
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
			lowerPromList.pullUpEl =  document.getElementById('pullUp');
			lowerPromList.pullUpOffset = lowerPromList.pullUpEl.offsetHeight;
			lowerPromList.myScroll = new iScroll(lowerPromList.scrollListId, {
				useTransition: true,
				topOffset: lowerPromList.pullDownOffset,
				onRefresh: function () {
					if (lowerPromList.pullUpEl.className.match('loading')) {
						lowerPromList.pullUpEl.className = '';
						lowerPromList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载...';
					}
				},
				onScrollMove: function () {
					if (this.y < (this.maxScrollY - 5) && !lowerPromList.pullUpEl.className.match('flip')) {
						lowerPromList.pullUpEl.className = 'flip';
						lowerPromList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '松开刷新...';
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 5) && lowerPromList.pullUpEl.className.match('flip')) {
						lowerPromList.pullUpEl.className = '';
						lowerPromList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉刷新...';
						this.maxScrollY = lowerPromList.pullUpOffset;
					}
				},
				onScrollEnd: function () {
					if (lowerPromList.pullUpEl.className.match('flip')) {
						lowerPromList.pullUpEl.className = 'loading';
						lowerPromList.pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';				
						lowerPromList.pullUpAction();	// Execute custom function (ajax call?)
					}
				}
			});
			setTimeout(function () { document.getElementById('lowerProm_list').style.left = '0'; }, 800);
		},
	};
	window.lowerPromList = lowerPromList;
})(window);


