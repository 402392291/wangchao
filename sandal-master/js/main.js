var CommonOper = {
	/** 初始化列表搜索框的方法
	 */
	init : function(){
		CommonOper.getQueryStringS();
		CommonOper.navTab();
		CommonOper.searchKeywords();
	},
	search : function (callback, loadCallback) {
		$('.d_ss_btn').bind('click',function(){
			if(!$(this).hasClass('ss_btn')){
				$(this).hide();
				$('.ss_input input').val('');
				$('.ss_input input').removeClass('focus');
				$(this).siblings('.close_btn').hide();	
				$(".d_czkh_list").hide();
				$('.mg_dls').show();
			}  			
		});

		$('.ss_input input').bind('focus',function(){
			$(this).addClass('focus');
			$('.d_ss_btn').show();
			var setTimer = setInterval(function(){
		       if($('.ss_input input').val()!=''){
		           $('.close_btn').show();
		           $('.d_ss_btn').addClass('ss_btn').html('搜索');
		           clearInterval(setTimer);
		       }
			},1000);
		});

		$('.ss_input input').bind('keydown keyup change',function(){
			if($(this).val()!=''){
				$(this).siblings('.close_btn').show();
				$('.d_ss_btn').addClass('ss_btn').html('搜索');
			}else{
				$(this).siblings('.close_btn').hide();
				$('.d_ss_btn').removeClass('ss_btn').html('取消');
			}  			
		});

		$('.ss_input .close_btn').bind('click',function(){
			$(this).siblings('input').val('').focus();
			$(this).hide();
			$('.d_ss_btn').removeClass('ss_btn').html('取消');
		});

		$('.d_ss_btn').bind('click',function(){
			if($(this).hasClass('ss_btn')){
				$('.d_czkh_list').show();
				$(this).removeClass('ss_btn').html('取消');
				var param = $('.ss_input input').val();
				callback(param, loadCallback);					
			}
		});
	},
	/**
	 * user lixiaohe
	 * use 已开通直播号方法
	 * createTime 2016-8-9
	 */
	navTab:function(){
		$(".screenNav_li span").css("margin-left",-$(".screenNav_li").width()/200+'rem');
		$(".allType_bg").css({"height":$(document).height()/50 -0.88-0.68+'rem',"background":"rgba(0,0,0,0.5)"});
		$(".screenNav_li").click(function() {
			var $this = $(this);
			var index = $this.index();
			if($(".screenNav_li").hasClass("activeNav")){
				$('.allType_cont').eq(index).hide();
				$('.allType_bg').hide();
				$('.allType_cont').eq(index).siblings('.allType_cont').hide();
			}
			$(this).siblings('.screenNav_li').removeClass('activeNav');
			$this.addClass("activeNav");
			$('.allType_cont').eq(index).show();
			$('.allType_bg').show();
			$('.allType_cont').eq(index).siblings('.allType_cont').hide();
		});
		$('.allType_bg,.hasOpenList').on('click',function(){
			if($(".allType_cont").show()){
				$(".allType_cont").hide();
				$('.allType_bg').hide();
			}else{
				$(".allType_cont").show();
				$('.allType_bg').show();
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
	/**
	 * 搜索框的样式方法
	 */
	searchKeywords:function(){
		$(".search_img").on("click",function(){
			$(this).hide();
			$("#keyword").focus();
		});
		$("#keyword").bind('keydown keyup change',function(){
			if($(this).val()!=''){
				$(this).siblings('.close_btn').show();
				$('.search_cancle').html('搜索');
				$(".hasOpenList_search .search_del").show();
				$(".lowerPromSearch .search_del").show();
			}else{
				$(this).siblings('.close_btn').hide();
				$('.search_cancle').html('取消');
				$(".hasOpenList_search .search_del").hide();
				$(".lowerPromSearch .search_del").show();
			}  			
		});
		$(".hasOpenList_search .search_del").on("click",function(){
			$("#keyword").val("");
			$(this).hide();
			$('.search_cancle').html('取消');
		});
		$(".lowerPromSearch .search_del").on("click",function(){
			$("#keyword").val("");
			$(this).hide();
			$('.search_cancle').html('取消');
		});
	},
	/**
	 * 公用的search方法
	 */
	commonSearch:function(search){
		$(".search_img").on("click",function(){
			$(this).hide();
			$("#keyword").focus();
		});
		$("#keyword").bind('keydown keyup change',function(){
			if($(this).val()!=''){
				$(this).siblings('.close_btn').show();
				$('.search_cancle').html('搜索');
				$("."+search +" .search_del").show();
			}else{
				$(this).siblings('.close_btn').hide();
				$('.search_cancle').html('取消');
				$("."+search +" .search_del").hide();
			}  			
		});
		$("."+search +" .search_del").on("click",function(){
			$("#keyword").val("");
			$(this).hide();
			$('.search_cancle').html('取消');
		});
		$("."+search +" .search_del").on("click",function(){
			$("#keyword").val("");
			$(this).hide();
			$('.search_cancle').html('取消');
		});
	}
};
$(function(){
	/**复选**/
	$('.checkBox').bind('click',function(){
		if($(this).hasClass('checked')){
			$(this).addClass('nochecked').removeClass('checked');
		}else{
			$(this).addClass('checked').removeClass('nochecked');
		}
	});
	/**开关**/
	$('.shBtn').bind('click touched',function(){
		if($(this).hasClass('opened')){
			$(this).removeClass('opened').parent().removeClass('open');
		}else{
			$(this).addClass('opened').parent().addClass('open');
		}
	});
	$(".radios .customer-radio").click(function() {
		var $this = $(this);
		$(this).siblings('.customer-radio').removeClass('label-radio-checked').addClass("label-radio");
		$this.addClass("label-radio-checked");
	});
});
/**
 * 确定、取消的弹出框
 */
var popupBox = {
	popupBoxDom:function(boxCont,popupBoxCont,boxBtnL,boxBtnR){
		var dom = '';
		dom += '<div class="popupBox_bg">';
		dom += '<section class="'+popupBoxCont +'">';
		dom += '<p>'+ boxCont +'</p>';
		dom += '<div class="boxBtn pubFlex"><span class="boxBtnL">'+boxBtnL+'</span><span class="boxBtnR autoFlex">'+boxBtnR+'</span></div>';
		dom += '</section>';
		dom += '</div>';
		$("body").append(dom);
		$("#pauseBtn").on("click",function(){
			$(".popupBox_bg").show();
		});
		$(".boxBtnL").on("click",function(){
			$(".popupBox_bg").hide();
		});
		// 确认暂停使用直播号
		$(".boxBtnR").bind("click",function(){
			pause(circleId, 1);
			$(".popupBox_bg").hide();
		});
	},	
};





