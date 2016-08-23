/**
 * 引用的公共js
 */
(function(window){
	var commonQuoteJs = {
			zmServer : "",
		/**
		 * 初始化引用js的方法
		 */
		init:function(){
			var host = window.location.host;
			var zmDomain = "zm.gaiay.net.cn";
			if (host) {
			 	if (host == "dev.ma.gaiay.net.cn")
			 		zmDomain = "dev.zm.gaiay.net.cn";
			 	else if (host == "ma.gaiay.net.cn")
			 		zmDomain = "zm.gaiay.net.cn";
			 	else if (host == "t.ma.gaiay.cn")
			 		zmDomain = "t.zm.gaiay.cn";
			 }
			commonQuoteJs.zmServer = "http://" + zmDomain;
			this.addCommonJs(commonQuoteJs.zmServer);
		},
		/**
		 * 给html追加js
		 */
		addCommonJs:function(zmDomain){
			var JsHtml = [];
			JsHtml.push('<script src="'+zmDomain+'/js/core/core.js"></script>');
			JsHtml.push('<script src="'+zmDomain+'/js/mobile/mobile.js"></script>');
			$("body").append(JsHtml);
		}
	};
	window.commonQuoteJs = commonQuoteJs;
})(window);