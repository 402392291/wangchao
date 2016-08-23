var spreadTools = {
	circleId : getQueryString('circleId'),
	userId : getQueryString('userId'),
	followerId:(getQueryString('followerId') != null)?getQueryString('followerId'):'',
	init:function(){
		this.judgeIsOfAppp();
		this.judgeIsOfSpread(2);
		this.bindEventByShare();
		this.consultingCustomerService();
	},
	/**
	 * [spreadShareHtml 推广分享工具条]
	 */
	spreadShareHtml:function(){
		var html = '<div class="share_btns"><a id="spShareBtn" href="javascript:;">分享</a><a id="spEwmBtn" href="javascript:;">生成二维码</a></div>';
		$('body').append(html);
	},
	/**
	 * [bindEventByShare 推广分享工具条绑定事件]
	 * @return {[type]} [description]
	 */
	bindEventByShare:function(){
		//分享按钮
		$('spShareBtn').bind('click',function(){

		});
		//生成二维码
		$('spEwmBtn').bind('click',function(){
			
		});
	},
	/**
	 * [judgeIsOfSpread 判断是否是推广]
	 * @param  {[type]} flag [是否是推广]
	 */
	judgeIsOfSpread:function(flag){
		if(flag==1){
			this.spreadShareHtml();
			if($('.share_btns').size() == 1){
				$('.dx_lcd_btns').hide();
			}
		}
	},
	getUserInfoSayHello:function(){
		var that = spreadTools;
		$.ajax({
			type: "Post",
			url: "/product/follower",
			data: "followerId="+that.followerId+"&source="+2+"&userId="+that.userId,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) { 
					that.userSayHelloInit(data);
				}
			},
			error:function(e){
				console.log(e.message);
			}
		});
	},
	/**
	 * [userSayHelloInit 用户say哈喽]
	 * @param  {[type]} logo   [用户头像]
	 * @param  {[type]} name   [用户姓名]
	 * @param  {[type]} depict [用户描述]
	 */
	userSayHelloInit:function(data){
		if(data.result.userName == undefined){
			$('.dx_top_hello').hide();
		}else{
			if(data.result.userLogo != '' && data.result.userLogo != 'undefined' && data.result.userLogo != undefined){
				$('.dx_th_logo').attr('src',data.result.userLogo);
			}
			$('.dx_th_text h3 span').text(data.result.userName);
			$('.dx_th_text p').text(data.result.depict);
		}
	},
	/**
	 * [ushiShare 判断页面是不是在app里]
	 */
	judgeIsOfAppp:function(){
		if(isZmApp()){
			$('.dx_top_hello').hide();
		}else{
			$('.dx_zx_btn').hide();
			$('.dx_top_hello').show();
			this.getUserInfoSayHello();
		}
	},
	/**
	 * [consultingCustomerService 判断页面是不是在app里]
	 */
	consultingCustomerService:function(){
		if(isZmApp()){
			$.ajax({
				type: "Post",
				url: "/product/follower",
				data:"circleId="+this.circleId+"&source=1",
				dataType: "json",
				success: function (data) {
					if (data.code == 0) { 
						$('#zxBtn').show();
						if(data.result.apphangxinType == 2){
							$('#zxBtn p').text('咨询客服');
						}else{
							$('#zxBtn p').text('咨询');
						}
						$("#zxBtn,#agentCode a").bind("click", function() {
							var key = "33";//跳转到掌信的业务代码
							var agentUserId = data.result.appZhangxinTo;
							m_app_native(agentUserId, key, '', '{}');
						});
					}
				},
				error:function(e){
					console.log(e.message);
				}
			});
		}else{
			$('#zxBtn').hide();
		}
	},
	/**
	 * [walletServerCfg 配置钱包sdk地址]
	 * @param num
	 * @returns {String}
	 */
	walletServerCfg:function(num){
		var walletServer = '';
		switch(num){
			case 1:
				walletServer = 'wallet.gaiay.net.cn';
			break;
			case 2:
				walletServer = 't.wallet.gaiay.net.cn';
			break;
			case 3:
				walletServer = 'm.wallet.gaiay.net.cn';
			break;
			default:
				walletServer = 'm.wallet.gaiay.net.cn';
			break;
		}
		return walletServer;
	},
	/**
	 * [isWeiXin 是否是微信浏览器]
	 */
	isWeiXin:function(){
		var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	        return true;
	    }else{
	        return false;
	    }
	},
	/**
	 * [paymentMode 支付方式]
	 */
	paymentMode:function(price, maxPrice){
		if(price > maxPrice){
			return 0;
		}else{
			return 1;
		}	
	},
};
spreadTools.init();