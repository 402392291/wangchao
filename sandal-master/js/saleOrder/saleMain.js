var CommonOper = {
	/** 初始化列表搜索框的方法
	 */
	init : function(){
		CommonOper.getQueryStringS();
		CommonOper.navTab();
	},
	/**
	 * user lixiaohe
	 * use 已开通直播号方法
	 * createTime 2016-8-9
	 */
	navTab:function(){
		$(".allType_bg").css({"height":$(document).height()/50 -0.88-0.68+'rem',"background":"rgba(0,0,0,0.5)"});
		$(".screenNav_li").click(function() {
			var $this = $(this);
			var index = $this.index();
			if($(".screenNav_li").hasClass("activeNav")){
				$('.allType_cont').eq(index).hide();
				$('.allType_cont').eq(index).siblings('.allType_cont').hide();
			}
			$(this).siblings('.screenNav_li').removeClass('activeNav');
			$this.addClass("activeNav");
			$('.allType_cont').eq(index).show();
			$('.allType_cont').eq(index).siblings('.allType_cont').hide();
		});
		$('.allType_bg,.hasOpenList').on('click',function(){
			if($(".allType_cont").show()){
				$(".allType_cont").hide();
			}else{
				$(".allType_cont").show();
			}
		});
	},
	/**
	 * 获取地址栏上的参数，如果没有不管什么类型返回""
	 */
	getQueryStringS:function(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return "";
	},
};
