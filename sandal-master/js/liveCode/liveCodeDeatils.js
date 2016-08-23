var liveCodeDeatils = {	
	liveCodeId : getQueryString("productId"),//直播号id
	userId : getQueryString("userId"),//用户id
	circleId : getQueryString("circleId"),//社群id
	liveCodeName : decodeURI(getQueryString("liveCodeName")),//直播号name
	followerId : getQueryString("followerId"),
	token : getQueryString("token"),
	circleCode : '',
	change : '',
	agentCode : '',
	mobileBind : 'true',
	userName : '',
	create:'',
	agentName:'',
	loginUrl :'http://zm.gaiay.net.cn/zhangmen/cards/create/vas'+'?redirectUrl='+encodeURIComponent(window.location.href), //document.domain;
	init:function(){
		if(this.token != undefined){
			this.getUserIdByToken();
		}
		this.getLcInfoByLcId();
		this.bindEventByBtn();
	},
	/**
	 * [getUserIdByToken 根据token获取userid]
	 */
	getUserIdByToken:function(){
		var that = liveCodeDeatils;
		$.ajax({
			type: "Post",
			url: "/ma/login/user",
			data: "token=" + that.token,
			dataType: "json",
			async:false,
			success: function (data) {
				if (data.code == 0) { 
					that.userId = data.result;
				}
			},
			error:function(e){
				console.log(e.message);
			}
		});
	},
	/**
	 * [getLcInfoByLcId 根据直播号id查询直播号详情]
	 * @return {[type]} [description]
	 */
	getLcInfoByLcId:function(){
		var that = liveCodeDeatils;
		$.ajax({
			type: "Post",
			url: "/product/detail",
			data: "productId=" + that.liveCodeId,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) { 
					that.setLiveCodeInfo(data);
				}
			},
			error:function(e){
				console.log(e.message);
			}
		});
	},
	/**
	 * [setLiveCodeInfo 设置直播号详情]
	 */
	setLiveCodeInfo:function(data){
		$('title').text(data.result.name);
		this.liveCodeName = (this.liveCodeName == undefined || this.liveCodeName == '') ? data.result.name : '';
		$('.dx_yx_pic img').attr('src',data.result.productCover);
		$('.dx_yx_pic p').text(data.result.salesWords);
		if(data.result.salesVideo == '' || data.result.salesVideo == undefined){
			$('.dx_lcd_video').css('display','none');
		}else{
			$('.dx_lcd_video').css('display','block');
			$('.dx_lcd_video video').attr('src',data.result.salesVideo);
		}
		$('.dx_lcd_recommend').html(data.result.description);
		$('#liveCodePrice').text(data.result.price);
		var limit = {'-1':'永久','7':'7天','30':'1个月','90':'3个月','365':'1年'};
		var limitDay = data.result.limitDay;
		if(limit[limitDay] == undefined){
			$('#liveCodeLimited').text(data.result.limitDay+"天");
		}else{
			$('#liveCodeLimited').text(limit[limitDay]);
		}
		$('.dx_lcd_video video').attr('poster',data.result.videoCover);
	},
	/**
	 * [openLiveCodeByOpenType 根据开通类型判断开通直播号]
	 * @return {[type]} [description]
	 */
	openLiveCodeByOpenType:function(){
			if(!isZmApp()){
				this.getCircleList();
			}else{				
				this.getLiveCodePromptInfo();
			}
			//'setOpenLiveCodeInfo.html?userId='+this.userId+'&productId='+this.liveCodeId+'&circleId='+this.circleId+'&circleCode='+this.circleCode+'&change='+this.change+'&agentCode='+this.agentCode;
	},
	/**
	 * [openLiveCode 开通直播号]
	 * @return {[type]} [description]
	 */
	openLiveCode:function(url){
		window.location.href = url;
	},
	/**
	 * [getLiveCodePromptInfo 获取直播号提示信息]
	 * @return {[type]} [description]
	 */
	getLiveCodePromptInfo:function(){
		var that = liveCodeDeatils;
		$.ajax({
			type: "Post",
			url: "/product/follower",
			data: "circleId="+that.circleId+"&source=1&hasOpenInfo=1",
			dataType: "json",
			async:false,
			success: function (data) {
				if (data.code == 0) { 
					that.setLiveCodePromptInfo(data);
				}
			},
			error:function(e){
				console.log(e.message);
			}
		});
	},
	/**
	 * [setLiveCodePromptInfo 设置直播号提示信息]
	 * @return {[type]} [description]
	 */
	setLiveCodePromptInfo:function(data){
		var that = liveCodeDeatils;
		that.circleCode = data.result.circleCode;
		$('.upgrade_circle img').attr('src',data.result.circleLogo);
		$('#circleName').text(data.result.circleName);
		$('#circleNum').text(data.result.circleCode);
		if(data.result.openProductId == ''|| data.result.openProductId == undefined){
			that.hideUpgradeWin();
			that.getAgentCode();
			var url = 'setOpenLiveCodeInfo.html?t='+new Date().getTime();
			if(undefined!=typeof(that.userId) && null!=that.userId && ''!=that.userId){ url += '&userId='+that.userId; }
			if(undefined!=typeof(that.liveCodeId) && null!=that.liveCodeId && ''!=that.liveCodeId){ url += '&productId='+that.liveCodeId; }
			if(undefined!=typeof(that.circleId) && null!=that.circleId && ''!=that.circleId){ url += '&circleId='+that.circleId; }
			if(undefined!=typeof(that.circleCode) && null!=that.circleCode && ''!=that.circleCode){ url += '&circleCode='+that.circleCode; }
			if(undefined!=typeof(that.change) && null!=that.change && ''!=that.change){ url += '&change='+that.change; }
			if(undefined!=typeof(that.agentCode) && null!=that.agentCode && ''!=that.agentCode){ url += '&agentCode='+that.agentCode; }
			if(undefined!=typeof(that.agentName) && null!=that.agentName && ''!=that.agentName){ url += '&agentName='+that.agentName; }
			if(undefined!=typeof(that.mobileBind) && null!=that.mobileBind && ''!=that.mobileBind){ url += '&mobileBind='+that.mobileBind; }
			if(undefined!=typeof(that.create) && null!=that.create){ url += '&create='+that.create; }
			if(undefined!=typeof(that.userName) && null!=that.userName && ''!=that.userName){ url += '&userName='+that.userName; }
			if(undefined!=typeof(that.followerId) && null!=that.followerId && ''!=that.followerId){ url += '&followerId='+that.followerId;}
			that.openLiveCode(url);	
		}else{
			that.agentCode = data.result.openInviteCode == undefined ? data.result.openAgentCode : data.result.openInviteCode;
			if(undefined == typeof(that.agentCode) || null == that.agentCode || '' == that.agentCode){
				that.agentCode = data.result.followerInviteCode;
			}
			that.showUpgradeWin();
			if(data.result.openProductId == that.liveCodeId){
				$('#shengJiBtn').text('续费');
				$('.upgrade_text').text('该社群当前已配置'+that.liveCodeName+'，该增值服务尚 未到期。您是否要续费延长使用时间？');
			}else{
				$('#shengJiBtn').text('升级');
				$('.upgrade_text').text('该社群当前已配置'+data.result.openProductName+'，该增值服务尚 未到期。更换后原增值服务将作废！是否为 其开通'+that.liveCodeName+'？');
				that.change = '0';
			}	
		}
		
	},
	/**
	 * 获取agentCode
	 * @param data
	 */
	getAgentCode:function(){
		var that = liveCodeDeatils;
		$.ajax({
			type: "Post",
			url: "/product/follower",
			data: "circleId="+that.circleId+"&source=1&hasOpenInfo=1&followerId="+that.followerId,
			dataType: "json",
			async:false,
			success: function (data) {
				if (data.code == 0) { 
					that.agentCode = data.result.openInviteCode == undefined ? data.result.openAgentCode : data.result.openInviteCode;
					if(undefined == typeof(that.agentCode) || null == that.agentCode || '' == that.agentCode){
						that.agentCode = data.result.followerInviteCode;
					}
				}
			},
			error:function(e){
				console.log(e.message);
			}
		});		
	},
	/**
	 * [showUpgradeWin 显示开通直播号提示信息]
	 * @return {[type]} [description]
	 */
	showUpgradeWin:function(){
		$('#backBg,#upgradeWin').show();
	},
	/**
	 * [hideUpgradeWin 隐藏开通直播号提示信息]
	 * @return {[type]} [description]
	 */
	hideUpgradeWin:function(){
		$('#backBg,#upgradeWin').hide();
	},
	bindEventByBtn:function(){
		var that = liveCodeDeatils;
		//取消关闭提示
		$('#exitBtn').bind('click',function(){
			that.hideUpgradeWin();
		});
		//确定去购买
		$('#shengJiBtn').bind('click',function(){
			that.hideUpgradeWin();
			//'setOpenLiveCodeInfo.html?userId='+that.userId+'&productId='+that.liveCodeId+'&circleId='+that.circleId+'&circleCode='+that.circleCode+'&change='+that.change+'&agentCode='+that.agentCode;
			var url = 'setOpenLiveCodeInfo.html?t='+new Date().getTime();
			if(undefined!=typeof(that.userId) && null!=that.userId && ''!=that.userId){ url += '&userId='+that.userId; }
			if(undefined!=typeof(that.liveCodeId) && null!=that.liveCodeId && ''!=that.liveCodeId){ url += '&productId='+that.liveCodeId; }
			if(undefined!=typeof(that.circleId) && null!=that.circleId && ''!=that.circleId){ url += '&circleId='+that.circleId; }
			if(undefined!=typeof(that.circleCode) && null!=that.circleCode && ''!=that.circleCode){ url += '&circleCode='+that.circleCode; }
			if(undefined!=typeof(that.change) && null!=that.change && ''!=that.change){ url += '&change='+that.change; }
			if(undefined!=typeof(that.agentCode) && null!=that.agentCode && ''!=that.agentCode){ url += '&agentCode='+that.agentCode; }
			if(undefined!=typeof(that.agentName) && null!=that.agentName && ''!=that.agentName){ url += '&agentName='+that.agentName; }
			if(undefined!=typeof(that.mobileBind) && null!=that.mobileBind && ''!=that.mobileBind){ url += '&mobileBind='+that.mobileBind; }
			if(undefined!=typeof(that.create) && null!=that.create){ url += '&create='+that.create; }
			if(undefined!=typeof(that.userName) && null!=that.userName && ''!=that.userName){ url += '&userName='+that.userName; }
			if(undefined!=typeof(that.followerId) && null!=that.followerId && ''!=that.followerId){ url += '&followerId='+that.followerId;}
			that.openLiveCode(url);			
		});
		//立即开通绑定事件
		$('#liJiKaiTong').bind('click',function(){
			that.openLiveCodeByOpenType();
		});		
		//关闭选择社群绑定事件
		$('.cw_close_btn').bind('click',function(){
			that.hideCircleWin();
		});			
	},
	/**
	 * [showCircleWin 显示选择社群提示信息]
	 * @return {[type]} [description]
	 */
	showCircleWin:function(){
		$('#backBg,#circleWin').show();
	},
	/**
	 * [hideCircleWin 隐藏选择社群提示信息]
	 * @return {[type]} [description]
	 */
	hideCircleWin:function(){
		$('#backBg,#circleWin').hide();
		$('.cw_list').html('');
	},
	/**
	 * [selectedCircle 判断点击的社群是否开通过直播号]
	 * create  0:创建  1:选择
	 */
	selectedCircle:function(){
		var that = liveCodeDeatils;
		$('.cw_list li').bind('click',function(){
			that.circleId = $(this).attr('data-id');
			that.circleCode = $(this).attr('data-code');
			if($(this).hasClass('create_circle')){
				that.create = 0;
			}
			$('#circleWin').hide();
			that.getLiveCodePromptInfo();
		});
	},
	/**
	 * [getCircleList 拉取社群列表]
	 */
	getCircleList:function(){
		var that = liveCodeDeatils;
		$.ajax({
			type: "Post",
			url: "/product/my-circle-list",
			data: "userId=" + that.userId,
			dataType: "json",
			success: function (data) {
				that.setCircleList(data);
			},
			error:function(e){
				console.log(e.message);
			}
		});
	},
	/**
	 * [setCircleList 填充社群列表]
	 */
	setCircleList:function(data){
		if(data.code == 0 && data.result){
			var result = data.result;
			this.userMobile = result.userMobile;
			this.userId = result.userId;
			this.userName = encodeURI(encodeURI(result.userName));
			this.agentName = encodeURI(encodeURI(result.openAgentName == undefined ? '' : result.openAgentName));
			if(result.list != undefined){
				if(result.list.length > 0){
					this.showCircleWin();
					this.getAgentCode();
					$('.cw_list').html('');
					for(var i = 0; i<data.result.list.length; i++){
						var html = '<li data-id="'+data.result.list[i].id+'" data-code="'+data.result.list[i].code+'"><img src="'+data.result.list[i].logo+'"><p>'+data.result.list[i].name+'</p>';
						if(data.result.list[i].agentOpenStatus == 3){
							html +='<a href="javascript:;">已开通</a>';
							$('#circleWin .cw_text').show();
							$('#circleWin .cw_text span').text(data.result.openAgentName);
						}	
						html +='</li>';
						$('.cw_list').append(html);
					}
					html = '<li id="createCircle" class="create_circle" style="display:none;"><img src="../../images/liveCode/dx_icon_05.png"><p class="hui">创建新社群开通直播号</p></li>';
					$('.cw_list').append(html);
					if(data.result.list.length <= 2 && data.result != undefined){
						$('#createCircle').show();
					}
					this.selectedCircle();
				}
			}else{
				this.getAgentCode();
				this.mobileBind = true;
				if(this.userMobile == '' || this.userMobile == undefined){
					this.mobileBind = false;
				}
				/*
				var url = 'setOpenLiveCodeInfo.html?userId='+this.userId+'&productId='
				+this.liveCodeId+'&circleId='+this.circleId+'&circleCode='+this.circleCode
				+'&change='+this.change+'&agentCode='+this.agentCode+'&mobileBind='+this.mobileBind+"&create=0"
				+'&userName='+this.userName;
				*/
				if(!spreadTools.isWeiXin() && (this.userId == '' || this.userId == undefined)){//判断是否登录
					window.location.href = this.loginUrl; //document.domain;
				}else{
					var url = 'setOpenLiveCodeInfo.html?t='+new Date().getTime();
					if(undefined!=typeof(this.userId) && null!=this.userId && ''!=this.userId){ url += '&userId='+this.userId; }
					if(undefined!=typeof(this.liveCodeId) && null!=this.liveCodeId && ''!=this.liveCodeId){ url += '&productId='+this.liveCodeId; }
					if(undefined!=typeof(this.circleId) && null!=this.circleId && ''!=this.circleId){ url += '&circleId='+this.circleId; }
					if(undefined!=typeof(this.circleCode) && null!=this.circleCode && ''!=this.circleCode){ url += '&circleCode='+this.circleCode; }
					if(undefined!=typeof(this.change) && null!=this.change && ''!=this.change){ url += '&change='+this.change; }
					if(undefined!=typeof(this.agentCode) && null!=this.agentCode && ''!=this.agentCode){ url += '&agentCode='+this.agentCode; }
					if(undefined!=typeof(this.agentName) && null!=this.agentName && ''!=this.agentName){ url += '&agentName='+this.agentName; }
					if(undefined!=typeof(this.mobileBind) && null!=this.mobileBind && ''!=this.mobileBind){ url += '&mobileBind='+this.mobileBind; }
					if(undefined!=typeof(this.userName) && null!=this.userName && ''!=this.userName){ url += '&userName='+this.userName; }
					if(undefined!=typeof(this.followerId) && null!=this.followerId && ''!=this.followerId){ url += '&followerId='+this.followerId;}
					url += '&create=0';
					this.openLiveCode(url);
				}
			}
		}else{
			/*
			var url = 'setOpenLiveCodeInfo.html?userId='+this.userId+'&productId='
			+this.liveCodeId+'&circleId='+this.circleId+'&circleCode='+this.circleCode
			+'&change='+this.change+'&agentCode='+this.agentCode+"&mobileBind=false&create=0";
			*/
			if(!spreadTools.isWeiXin() && (this.userId == '' || this.userId == undefined || this.userId == 'null')){//判断是否登录
				window.location.href =this.loginUrl;
			}else{
				var url = 'setOpenLiveCodeInfo.html?t='+new Date().getTime();
				if(undefined!=typeof(this.userId) && null!=this.userId && ''!=this.userId){ url += '&userId='+this.userId; }
				if(undefined!=typeof(this.liveCodeId) && null!=this.liveCodeId && ''!=this.liveCodeId){ url += '&productId='+this.liveCodeId; }
				if(undefined!=typeof(this.circleId) && null!=this.circleId && ''!=this.circleId){ url += '&circleId='+this.circleId; }
				if(undefined!=typeof(this.circleCode) && null!=this.circleCode && ''!=this.circleCode){ url += '&circleCode='+this.circleCode; }
				if(undefined!=typeof(this.change) && null!=this.change && ''!=this.change){ url += '&change='+this.change; }
				if(undefined!=typeof(this.agentCode) && null!=this.agentCode && ''!=this.agentCode){ url += '&agentCode='+this.agentCode; }
				if(undefined!=typeof(this.agentName) && null!=this.agentName && ''!=this.agentName){ url += '&agentName='+this.agentName; }
				if(undefined!=typeof(this.mobileBind) && null!=this.mobileBind && ''!=this.mobileBind){ url += '&mobileBind='+this.mobileBind; }
				if(undefined!=typeof(this.userName) && null!=this.userName && ''!=this.userName){ url += '&userName='+this.userName; }
				if(undefined!=typeof(this.followerId) && null!=this.followerId && ''!=this.followerId){ url += '&followerId='+this.followerId;}
				url += '&create=0';
				this.openLiveCode(url);	
			}
		}		
	},
	
};
liveCodeDeatils.init();