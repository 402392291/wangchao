var liveCodeList = {	
	userId:getQueryString('userId'),
	circleId:getQueryString('circleId'),
	followerId:(getQueryString('followerId') != null)?getQueryString('followerId'):'',
	init:function(){
		//在app端有可能没有传递userId，这个时候就需要通过接口从app里取
		if( m_app_is_mobile() && (liveCodeList.userId ==  undefined || liveCodeList.userId == null || liveCodeList.userId == "")){
			var userInfo = m_app_getUserInfo();
			liveCodeList.userId = userInfo.userId;
		}
		this.getLiveCodeInfo();		
	},
	/**
	 * [getLiveCodeInfo 获取直播号列表信息]
	 */
	getLiveCodeInfo:function(){
		var that = liveCodeList;
		var canshu = 'followerId='+that.followerId+'&circleId=' + that.circleId;
		$.ajax({
			type: "Post",
			url: "/product/list",
			data: canshu,
			dataType: "json",
			success: function (data) {
				if (data.code == 0) { 
					that.liveCodehtml(data,'.dx_list_con');
					that.bindEventByLi();
				}
			},
			error:function(e){
				console.log(e.message);
			}
		});
	},
	/**
	 * [liveCodehtml 直播号列表初始化]
	 * @param  {[type]} name  [直播号名称]
	 * @param  {[type]} price [直播号价格]
	 * @param  {[type]} time  [直播号时限]
	 * @param  {[type]} obj   [直播号名称]
	 */
	liveCodehtml:function(data,obj){
		var result = data.result;
		if(result != undefined){
			for (var i = 0; i< result.length; i++) {
				var htmlList = '<li data-id="'+result[i].pId+'" data-name="'+result[i].pName+'"><div class="dx_list_info"><p>'+result[i].pName+'</p><p>'+result[i].pPriceShow+'/'+result[i].pLimitDayShow+'</p></div><div class="dx_open_btn"><a href="javascript:;">开通</a></div></li>';
				$(obj).append(htmlList);
			}
		}
	},
	/**
	 * [bindEventByLi 直播号列表绑定事件]
	 */
	bindEventByLi:function(){
		$('.dx_list_con li').bind('click',function(){
			var that = liveCodeList;
			var liveCodeId = $(this).attr('data-id');
			var liveCodeName = $(this).attr('data-name');
			
			var toUrl = 'liveCodeDetails.html?t='+new Date().getTime();
			if(undefined!=typeof(liveCodeId) && null!=liveCodeId && ''!=liveCodeId){ toUrl += '&productId='+liveCodeId; }
			if(undefined!=typeof(liveCodeName) && null!=liveCodeName && ''!=liveCodeName){ toUrl += '&liveCodeName='+encodeURI(encodeURI(liveCodeName));}
			if(undefined!=typeof(that.userId) && null!=that.userId && ''!=that.userId){ toUrl += '&userId='+that.userId;}
			if(undefined!=typeof(that.circleId) && null!=that.circleId && ''!=that.circleId){ toUrl += '&circleId='+that.circleId;}
			if(undefined!=typeof(that.followerId) && null!=that.followerId && ''!=that.followerId){ toUrl += '&followerId='+that.followerId;}
			
			window.location.href=toUrl;//'liveCodeDetails.html?productId='+liveCodeId+'&liveCodeName='+encodeURI(encodeURI(liveCodeName))+'&userId='+that.userId+'&circleId='+that.circleId+'&followerId='+that.followerId;
		});
	}
};
liveCodeList.init();