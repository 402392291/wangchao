/**
 * 直播号推广的js
 */
(function(window){
	/**
	 * 厅长推广直播号
	 */
	window.promotion = {
			shareContent:'',
			userName:'',
			productCover:'',
			promoterRole:'',
		/**
		 * 初始化推广直播号方法
		 */		
		initDirectorProm:function(){
			promotion.promoterRole = CommonOper.getQueryStringS('promoterRole');
			if(promotion.promoterRole == ''){
				promotion.promoterRole = 2;
			}
			if(promotion.promoterRole == 1){//厅长
				this.directorPromText();
				this.getDireData();
			}else if(promotion.promoterRole == 2){//推广者
				this.promoterHeadData();
				this.getDireData();
			}
			this.promterinfor();
			this.directiorQRCode();
			this.onclickUrl();
		},
		/**
		 * onclick跳转地址
		 */
		onclickUrl:function(){
			$("#directior_list").on("click",function(){
				//厅长推广页面跳转列表页地址
				window.location.href='/statics/html/promotion/promList.html?followerId='+followerId+"&userId="
				+userId+"&promoterRole="+promotion.promoterRole;
			});
			$("#directior_list_share").on("click",function(){
				var link = 'http://'+window.location.host +  
					'/statics/html/liveCode/liveCodeList.html?followerId='+followerId;
				var pic = 'http://'+window.location.host + 
					'/statics/images/promotion/share_default.png';
				var title = promotion.userName+"邀请你开通直播号";
				var desc = '开通直播号，进入全民直播时代，还能领分润哦。';
				promotion.shareContent = '{"pic":"'+pic+'","title":"'+title+'","desc":"'+desc
					+'","link":"'+link+'"}';
				m_app_share("{\"type\":391}");
			});
		},
		/**
		 * 厅长header部分的内容
		 */
		directorPromText:function(){
			$("header").addClass("directiorProm_header");
			var html = "";
			html += '<p class="directiorProm_txt">1、推广直播号赚取分润，推广越多分润越多！推广直播号赚取分润，推广越多分润越多！推广直播号赚取分润，推广越多分润越多！推广直播号赚取分润，推广越多分润越多！推广直播号赚取分润，推广越多分润越多！</p>';
			html += '<p class="directiorProm_txt">2、还可以发展下级推广者，推广越多分润越多！还可以发展下级推广者，推广越多分润越多！</p>';
			$("header").append(html);
		},
		/**
		 * 厅长推广列表dom
		 */
		directorDomList:function(data,userName){
			var dom = "";
			var datas = data.result;
			for (var i = 0; i < datas.length; i++) {
				var obj = datas[i];
				var productId = obj.pId;
				var productCover = obj.productCover;
				if(productCover == ''|| productCover == null){
					productCover = 'http://'+window.location.host + 
					'/statics/images/promotion/productCover_default.png';;
				}
				var url = 'http://'+window.location.host + 
				'/statics/html/liveCode/liveCodeDetails.html?followerId='
				+followerId+'&productId='+productId;
				dom += '<dl class="pubFlex">';
				dom += '<dt class="oneline_text" onclick="window.location.href=\'/statics/html/promotion/promDetails.html?followerId='
					+followerId+'&productId='+obj.pId+'\'">'+ obj.pName +'</dt>';
				dom += '<dd class="autoFlex">';
				dom += '<span class="qRCode" onclick="window.promotion.toCommonQR(\''+url+'\',\''+productCover+'\');">二维码</span>';
				dom += '<span class="share detailShare" onclick="window.promotion.detailShare(\''+obj.pId+'\',\''+obj.pName+'\')">分享</span>';
				dom += '</dd></dl>';
			}
			$(".directiorProm_cont").append(dom);
		},
		/**
		 * 推广详情页的分享
		 */
		detailShare:function(id, name){
			var pic = 'http://'+window.location.host + 
				'/statics/images/promotion/share_default.png';
			var link = 'http://'+window.location.host +  
				'/statics/html/liveCode/liveCodeDetails.html?followerId='
				+followerId+'&productId='+id;
			var title = promotion.userName+"邀请你开通直播号";
			var desc = '开通直播号，进入全民直播时代，还能领分润哦。';
			promotion.shareContent = '{"pic":"'+pic+'","title":"'+title+'","desc":"'+desc
					+'","link":"'+link+'","id":"'+id+'"}';
			m_app_share("{\"type\":391}");
		},
		/**
		 * 获取厅长推广列表数据
		 */
		getDireData:function(){
			$.ajax({
				url :"/product/list?followerId=" + followerId+"&agentCode="+agentCode+"&userId="+userId,
				type : "GET", 
				dataType : "json",
				success : function(data){
					if(data.code == 0){
						promotion.directorDomList(data);
					}
				}
				
			});
		},
		/**
		 * 获取推广者推广列表头部
		 */
		promoterHeadData:function(){
			$.ajax({
				url :"/promotion/promoter/statistics/"+userId,
				type : "GET", 
				dataType : "json",
				success : function(data){
					promotion.promoterPromHead(data);
				}
				
			});
		},
		/**
		 * 推广者推广列表头部html
		 */
		promoterPromHead:function(data){
			var domData = data.result;
			$("header").addClass("promoterProm_header");
			var dom = '';
			dom += '<section class="promoterProm_income"><p class="p1">';
			dom += '<span>我的分润(元)</span>';
			dom += '<a onclick="window.location.href=\'/statics/html/promotion/promProfit.html?userId='+userId+'&role=2\'">查看明细</a></p>';
			if(data.code == 0){
				dom += '<p class="p2" ><span id="income">'+domData.earning+'</span></p>';
			}else{
				dom += '<p class="p2" ><span id="income">0</span></p>';
			}
			dom += '<p class="borderDotted"></p>';
			dom += '</section>';
			dom += '<section class="promoterProm_Statistics"><p class="low_total">';
			dom += '<span>下级推广者(人)</span>';
			if(data.code == 0){
				dom += '<strong id="lowProm_num">'+domData.firstCount+'</strong>';
			}else{
				dom += '<strong id="lowProm_num">0</strong>';
			}
			dom += '</p>';
			dom += '<p class="low_total">';
			dom += '<span>推广数量(个)</span>';
			if(data.code == 0){
				dom += '<strong id="prom_num">'+domData.orderCount+'</strong>';
			}else{
				dom += '<strong id="prom_num">0</strong>';
			}
			dom += '</p>';
			dom += '</section>';
			$("header").append(dom);
		},
		/**
		 * 推广页面二维码推广列表带图片的方法
		 */
		directiorQRCode:function(){
			var pic = 'http://'+window.location.host + "/statics/images/liveCode/dx_icon_02.png";
			$("#directior_qRCode,#shengchengBtn").on("click",function(){
				promotion.toCommonQR('',pic);
			});
		},
		/**
		 * @description 推广直播号，二维码生成，需要跳转APP
		 * @param 头像（头像URL）
		 * @param 问候语
		 * @param 姓名
		 * @param 提示描述
		 * @param 提示图片地址
		 * @param 二维码跳转地址
		 * TODO 找PO确定不同入口，显示内容和跳转链接是否不一样
		 */
		toCommonQR:function(wUrl,tipUrl){
			var uLogo = "";
			var greetings = "Hi,我是";
			var uName = promotion.userName;
			var tipDesc = "现在是全民直播的时代了，我已经在掌门中开通了直播号，你也赶紧开一个直播号吧！";
			var pic = tipUrl;
			if(pic == '' || pic == 'undefined'|| pic == undefined ){
				pic = promotion.productCover;
			}
			var agentSlogan = "推广直播号成功可获得分润，推广越多分润越多！";
			if(wUrl == ''|| wUrl == undefined){
				wUrl = 'http://'+window.location.host + 
				'/statics/html/liveCode/liveCodeList.html?followerId='
				+followerId;
			}
			if(uName == "" && followerId != ""){
				$.ajax({
					type:"get",
					url:"/promotion/user/" + followerId,
					dataType:"json",
					async:false, 
					success:function(data){
						if(data.code == 0){
							uName = data.result.userName;
							uLogo = data.result.userLogo;
						}
					}
				});
			}
			m_app_toAgentQR(uLogo, greetings, uName, tipDesc, tipUrl, agentSlogan, wUrl);
		},
		/**
		 * 初始化厅长推广列表页面数据
		 */
		initPromList:function(){
			this.promterinfor();
			this.promoListData();
			this.onclickUrl();
			this.directiorQRCode();
		},
		/**
		 * 头部推广者的信息
		 */
		promterinfor:function(){
			$.ajax({
				url :"/promotion/user/" + followerId,
				type : "GET", 
				dataType : "json",
				success : function(data){
					if(data.code == 0){
						promotion.userName = data.result.userName;
						var url = data.result.userLogo;
						if(url == ''|| url == null){
							url = '/statics/images/liveCode/headPic.png';
						}
						$(".dx_th_logo").attr("src",url);
						$(".dx_th_Name").text(promotion.userName);
					}
				}
			});
		},
		/**
		 * 厅长推广列表页面的数据
		 */
		promoListData:function(){
			$.ajax({
				url :"/product/list?followerId=" + followerId,
				type : "GET", 
				dataType : "json",
				success : function(data){
					if(data.code == 0){
						promotion.promoListDom(data);
					}
				}
			});
		},
		/**
		 *  厅长推广列表页面的 Dom
		 */
		promoListDom:function(data){
			var dom = '';
			var datas = data.result;
			for (var i = 0; i < datas.length; i++) {
				var obj = datas[i];
				dom += '<li onclick="window.location.href=\'/statics/html/promotion/promDetails.html?followerId='+followerId+'&productId='+obj.pId+'\'">';
				dom += '<div class="dx_list_info">';
				dom += '<p class="oneline_text">'+obj.pName+'</p>';
				dom += '<p>'+obj.pPriceShow+'/'+obj.pLimitDayShow+'</p>';
				dom += '</div>';
				dom += '<div class="dx_open_btn"><a>开通</a></div>';
				dom += '</li>';
			}
			dom += '<p style="height:1.1rem;"></p>';
			$(".dx_list_con").append(dom);
		},
		/**
		 * 初始化推广详情页面的方法
		 */
		initpromDetails:function(){
			this.promterinfor();
			this.promDetailData();
			this.detailsQR();
		},
		initDetailShare : function (id, name) {
			$("#shareBtn").on("click", function(){
				promotion.detailShare(id, name);
			});
		},
		/**
		 * 详情页生成二维码
		 */
		 detailsQR:function(){
			 $("#shengchengBtn").on("click",function(){
				 url = 'http://'+window.location.host + 
				 	'/statics/html/liveCode/liveCodeDetails.html?followerId='+followerId+'&productId='+ productId;
				 promotion.toCommonQR(url);
			 });
		 },
		/**
		 * 直播号详情介绍
		 */
		promDetailData:function(){
			$.ajax({
				url :"/product/detail?productId=" + productId,
				type : "GET", 
				dataType : "json",
				success : function(data){
					if(data.code == 0){
						var datas = data.result;
						promotion.productCover = data.result.productCover;
						//初始化分享内容
						promotion.initDetailShare(datas.id, datas.name);
						$("title").text(data.result.name);
						promotion.promDetailDom(data);
						if(promotion.productCover == '' || promotion.productCover == undefined){
							promotion.productCover = 'http://'+window.location.host + 
								'/statics/images/promotion/productCover_default.png';
						}
						$(".dx_yx_pic img").attr("src",promotion.productCover);
					}
				}
			});
		},
		/**
		 * 直播号详情添加数据dom
		 */
		promDetailDom:function(data){
			var dom = '';
			var datas = data.result;
			dom += '<p>'+datas.description+'</p>';
			var limitDay = datas.limitDay;
			if(limitDay == -1){
				limitDay = '永久';
			}else{
				limitDay = datas.limitDay;
			}
			dom += '<p>配置：'+limitDay+'</p>';
			dom += '<p>价格：'+datas.price+'元</p>';
			dom += '<p>'+datas.salesWords+'</p>';
			$(".dx_lcd_recommend").append(dom);
		},
	};
	window.promotion = promotion;
})(window);

function zmShare() {
	return window.promotion.shareContent;
}