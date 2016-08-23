var managerObj = {
		managerId : "",
		agentCode : "",
		zmId : "",
		managerType : "",
//		createTime : "",
		status : "",
		name : "",
		logo : "",
		mobile : ""
};
//我的管理员
function getManagerListMyHtml(managerObj){
	var html = '<li>';
			html += '<img src="'+managerObj.logo+'" />';
			html += '<section class="czkh_list_text">';
				html += '<p>'+managerObj.name+'</p>';
				html += '<p>电话: '+managerObj.mobile+'</p>';
			html += '</section>';
			html += '<section class="my_kh_btns" style="margin-left: 5.3rem;">';
			html += '<a class="my_kh_btn jy_btn">禁用</a>';
			html += '"</section>';
		html += '</li>';
	return html;
}
//申请的管理员
function getManagerListShenHtml(){
	var html = '<li>';
			html = '<img src="../del_img/1.jpg">';
			html = '<section class="czkh_list_text">';
				html = '<p>张语默2</p>';
				html = '<p>电话: 13890876345</p>';
			html = '</section>';
			html = '<section class="my_kh_btns">';
				html = '<a class="my_kh_btn my_xq_jj">拒绝</a>';
				html = '<a class="my_kh_btn my_xq_tg">通过</a>';
			html = '</section>';
		html = '</li>';
	return html;
}