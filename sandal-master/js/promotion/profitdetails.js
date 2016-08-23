/**
 * 厅长的我的分润详情页面的数据信息
 */
(function(window){
	window.profitdetails = {
		/**
		 * 初始化方法
		 */	
		init:function(){
			var userId =  getQueryString("userId");
			var sfoId =  getQueryString("sfoId");
			var identity =  getQueryString("identity");
			this.loadProfitData(userId,sfoId,identity);
		},
		/**
		 * 加载我的分润详情的数据
		 */
		loadProfitData:function(userId,sfoId,identity){
			$.ajax({
				url :'/api/sf/order/detail/'+sfoId+'/?userId='+userId+'&identity='+identity,
				type : "GET", 
				dataType : "json",
				success : function(data){
					var datas = data.result;
					$("title").text(datas.profit.name);
					profitdetails.profitDom(datas,identity);
				}
				
			});
		},
		/**
		 * 添加我的分润详情的dom
		 */
		profitDom:function(datas,identity){
			$("#profitMoney").text(profitdetails.formatCurrency(datas.profit.money));
			$("#profitName").text(datas.profit.name);
			$("#profitTime").text(new Date(parseInt(datas.profit.time)).format("yyyy-MM-dd HH:mm:ss"));
			$("#orderName").text(datas.order.name);
			$("#ordermoney").text(profitdetails.formatCurrency(datas.order.money));
			if(datas.order.payment == 1){
				$("#orderPayment").text("未付费");
				$("#orderPayment").css({"color":"#ff2d2d"});
			}else{
				$("#orderPayment").text("已付费");
			}
			$("#profitNumber").text(datas.order.number);
			$("#orderNumber").text(datas.order.number);
			var profitDetails = $(".details_order");
			var dom = '';
			if(identity == 2){
				$(".profitNumber").show();
				$(".orderNumber").hide();
			}else if(identity == 1){
				if(sfType == 1){
					$(".profitNumber").hide();
					$(".orderNumber").show();
				}else if(sfType == 2){
					$(".profitNumber").show();
					$(".orderNumber").hide();
				}
			}
			var leve = datas.followers.level;
			if(leve == 1){
				leve = '一级';
			}else if(leve == 2){
				leve = '二级';
			}else if(leve == 3){
				leve = '三级';
			}
			if(identity == 1){
				dom += '<ul class="fenrunBox_info fenrunBox_info01">';
				dom += '<li><h1>分润详情</h1></li>';
				dom += '<li><h2>分润等级</h2><p>'+datas.followers.name+'</p></li>';
				dom += '<li><h2>分润比例</h2><p>'+level+'</p></li>';
				dom += '<li><h2>分润金额</h2><p>'+profitdetails.formatCurrency(datas.followers.money)+'</p></li>';
				dom += '<li><h2>贡献人</h2><p>'+datas.followers.name+'</p></li>';
				dom += '</ul>';
			}else if(identity == 2){
//				if(datas.sfType == 3){
//					dom += '<ul class="fenrunBox_info fenrunBox_info01">';
//					dom += '<li><h1>分润详情</h1></li>';
//					dom += '<li><h2>贡献营业厅</h2><p>'+datas.followers.name+'</p></li>';
//					dom += '<li><h2>贡献营业厅等级</h2><p>'+level+'</p></li>';
//					dom += '<li><h2>分润比例</h2><p>'+datas.followers.scale+'</p></li>';
//					dom += '<li><h2>分润金额</h2><p>'+profitdetails.formatCurrency(datas.followers.money)+'</p></li>';
//					dom += '</ul>';
//				}else
				if(datas.sfType == 2){
					dom += '<ul class="fenrunBox_item">';
					dom += ' <li><h1>分润详情</p></h1>';
					dom += '<li class="tit">';
					dom += '<p>身份</p>';
					dom += '<p>分润比例</p>';
					dom += '<p>分润金额</p>';
					dom += ' </li>';
					for(var int = 0;int < datas.followers.length; int++){
						dom += '<li class="tit">';
						dom += '<p>'+datas[int].followers.name+'</p>';
						dom += '<p>'+datas[int].followers.scale+'</p>';
						dom += '<p>'+profitdetails.formatCurrency(datas[int].followers.money)+'</p>';
						dom += ' </li>';
					}
			}
				dom += ' </ul>';
			}
			dom += '</section>';
			profitDetails.append(dom);
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
	};
	window.profitdetails = profitdetails;
})(window);