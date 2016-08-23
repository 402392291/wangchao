var customerObj = {
		id : "",
		agentCode : "",//代理商显示code
		circleId : "",//直播号(社群)id
		circleCode : "",//直播号(社群)数字号码
		productId : "",//产品Id
		expandType : "",//添加方式： 1、邀请添加 ；2、 扫码添加；3、主动添加
		chargeStatus : "",//收费状态 1：未交费，2：已缴费		【no(1), charge(2);】
		lockStatus : "",//锁定状态：1 未锁定；2 锁定      		【no(1), lock(2);】
		status : "",//管理员和直播号状态，1：邀请，2：绑定，3：开通，4封号，5：拒绝        		【invite(1), bind(2), open(3), close(4), refuse(5);】
		inviteTime : "",//管理员邀请群主开通直播号时间
		checkNum : "",//检查次数
		bindTime : "",//管理员和直播号绑定时间
		openTime : "",//管理员为群主开通直播号时间
		expireTime : "",//直播号到期失效时间
		closeTime : "",//直播号被封时间
		refuseTime : "",//管理员拒绝为群主开通直播号时间
		
		createTime : "",//创建时间
		updateTime : "",//修改更新时间
			
		pName : "",//产品名称
		
		circleName : "",//社群名称
		circleLogo : ""//社群logo
		
}
var productL = null;//某代理商的所有产品集合
//用户列表
function getCustomerListHtml(customerObj){
	var stateS = "";
	if("undefined"!=typeof(state)){
		stateS = state;
	}
	var html = '<li thisId="'+customerObj.id+'" thisCircleId="'+customerObj.circleId+'"  thisCircleCode="'+customerObj.circleCode+'"  onclick="toCricleSet(\''+customerObj.agentCode+'\', \''+customerObj.circleId+'\', \''+customerObj.productId+'\')" >';
			html += '<img src="'+customerObj.circleLogo+'" />';
			html += '<section class="czkh_list_text">';
				if(""==customerObj.circleName){
					html += '<p>&nbsp;</p>';
				}else{
					html += '<p>'+customerObj.circleName+'</p>';
				}
				html += '<p>'+customerObj.pName+'</p>';
			html += '</section>';
			html += '<section class="my_kh_text">';
				html += '<p>';
				if("1"==stateS || "2"==stateS || "3"==stateS || "4"==stateS || "5"==stateS){
					 /*
						 state=1  开通状态，查询chargeStatus=1,2   lockStatus=1,2   status=3,4
						 state=2  未收费状态，查询chargeStatus=1  status=3,4
						 state=3  已收费状态，查询chargeStatus=2  status=3,4
						 state=4  封号状态，查询status=4
						 state=5  锁定状态，查询lockStatus=2
					 */
					if(1==customerObj.chargeStatus){
						html += '未收费';
					}
					else if(2==customerObj.chargeStatus){
						html += '已收费';
					}
				}
				html += '</p>';
				html += '<p>';
				if("6"==stateS){//state=6 未开通状态 查询status=2
					if(""!=customerObj.bindTime && customerObj.bindTime>0){
						html += getFormatDateByLong(customerObj.bindTime,"yyyy-MM-dd HH:mm");
					}
				}
				html += '</p>';
			html += '</section>';
		html += '</li>';
	return html;
}
//跳转
function toCricleSet(agentCode, circleId, productId){
	if(""==agentCode || ""==circleId){
		return;
	}
	window.location.href = ctx+"custom/"+circleId+"/info?agCode="+agentCode+"&productId="+productId;
}

//申请用户列表
function getApplyCustomerListHtml(customerObj){
	var stateS = "";
	if("undefined"!=typeof(state)){
		stateS = state;
	}
	var html = '<li thisId="'+customerObj.id+'" thisCircleId="'+customerObj.circleId+'"  thisCircleCode="'+customerObj.circleCode+'"  onclick="toCricleSet(\''+customerObj.agentCode+'\', \''+customerObj.circleId+'\', \''+customerObj.productId+'\')" >';
			html += '<img src="'+customerObj.circleLogo+'" />';
			html += '<section class="czkh_list_text">';
				html += '<p>申请：'+customerObj.pName+'</p>';
				html += '<p>'+customerObj.circleName+'</p>';
			html += '</section>';
			html += '<section class="my_kh_text">';
				html += '<p></p>';
				html += '<p>';
					if(""!=customerObj.createTime && customerObj.createTime>0){
						html += getFormatDateByLong(customerObj.createTime,"yyyy-MM-dd HH:mm");
					}
				html += '</p>';
			html += '</section>';
		html += '</li>';
	return html;
}





/** 
* 
* 描述：js实现的map方法 
* @returns {Map} 
*/ 
function Map(){ 
	var struct = function(key, value) { 
		this.key = key; 
		this.value = value; 
	}; 
	// 添加map键值对 
	var put = function(key, value){ 
		for (var i = 0; i < this.arr.length; i++) { 
			if ( this.arr[i].key === key ) { 
				this.arr[i].value = value; 
				return; 
			} 
		}; 
		this.arr[this.arr.length] = new struct(key, value); 
	}; 
	// 根据key获取value 
	var get = function(key) { 
		for (var i = 0; i < this.arr.length; i++) { 
			if ( this.arr[i].key === key ) { 
				return this.arr[i].value; 
			} 
		} 
		return null; 
	}; 
	// 根据key删除 
	var remove = function(key) { 
		var v; 
		for (var i = 0; i < this.arr.length; i++) { 
			v = this.arr.pop(); 
			if ( v.key === key ) { 
				continue; 
			} 
			this.arr.unshift(v); 
		} 
	}; 
	// 获取map键值对个数 
	var size = function() { 
		return this.arr.length; 
	}; 
	// 判断map是否为空 
	var isEmpty = function() { 
		return this.arr.length <= 0; 
	}; 
	this.arr = new Array(); 
	this.get = get; 
	this.put = put; 
	this.remove = remove; 
	this.size = size; 
	this.isEmpty = isEmpty; 
} 

