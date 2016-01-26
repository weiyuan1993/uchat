//user資訊
var user = {
	name:"",
	sex:"",
	message:"",
	bighead:""
};
var receiveUser = 'all';

$(function(){
	var socket = io.connect(); //連接server
	$('#main').hide();
	$('.check').click(function(){	//輸入暱稱年齡後進入
		user.name = $('.name').val();
		user.sex = $('input[name=sex]:checked').val();
		if(user.name != "" && (user.sex == 'boy'||user.sex == 'girl') && user.name.length<=20){  //欄位不可為空
			$('#login').hide();
			$('#main').fadeIn('slow');
			$('#username').text(user.name);
			socket.emit('new user',user.name,user.sex);
		}else{
			alert("暱稱過長或有欄位沒填哦!");
		}
	});
		  	
	/*************按鈕動作**************/
	//傳送鍵
	$('.btn.send').click(function(){	
		sendMessage();
	});
	//Enter鍵
	$(document).keydown(function(event){   
	   	if(event.keyCode == 13){
			sendMessage();
		}
	});
	//設定鍵
	$('.btn.set').click(function(){
		$(".sidebar").animate({ left:'0px' }, 500 ,'swing');
		$('.btn.set').hide();
		$('.btn.close').show();
	});
	//sidebar 關閉鍵
	$('.btn.close').click(function(){
		$(".sidebar").animate({ left:'-320px' }, 500 ,'swing');
		$('.btn.close').hide();
		$('.btn.set').show();
	});
	//上傳大頭照鍵
	$('.btn.bighead').click(function(){
		$('#bighead').click();
	});
	$('.btn.changeBack').click(function(){
		$('#changeBack').click();
	});
	//登出鍵
	$('.btn.signout').click(function(){
		window.location.reload();
	});
	//選擇密語對象鍵
	$('#userSelect').change(function(){
		receiveUser = $('#userSelect').find(':selected').val();	
	});
	//上傳圖片鍵
	$('.btn.upload').click(function(){
		$('#upload').click();
	});

	/************圖片容器***************/
	//圖片上傳
	$('#upload').change(function(){
		if($('#upload').val()!=''){
			readUpload(this);
			$('#upload').val('');
		}
	});
	//大頭照上傳
	$('#bighead').change(function(){
		if($('#bighead').val()!=''){
			bigheadUpload(this);
			$('.mybighead').remove();
		}
	});
	//更換背景
	$('#changeBack').change(function(){
		if($('#changeBack').val()!=''){
			backgroundUpload(this);
		}
	});

	/*************socket.on*************/
    //接收別人的訊息
	socket.on('message',function(user, receiveUser, message, time,bighead){
		recieveMessage(user, receiveUser, message,time,bighead);
		if (Notification && Notification.permission === "granted") {
			if(document.hidden==true){//若APP不為前景頁面，則通知用戶訊息
      			spawnNotification(user+": "+message,"img/icons/icon48x48.png","U-Chat");
      		}
    	}
	});
	//接收別人的圖片
	socket.on('image',function(user, receiveUser, image, time,bighead){
		//公開頻道
		if(receiveUser=='all'){
			$('#msgcontent').append('<p>'+ user + ":" +'</p>',[$('<img>', {class:"otherImg" ,src: image})],'<p class="othersendTime">'+time+'</p>');
			
		}
		//私人頻道
		else{
				$('#msgcontent').append('<p>[密語]'+ user + ":" +'</p>',[$('<img>', {class:"otherImg" ,src: image})],'<p class="othersendTime">'+time+'</p>');
		}
		if (Notification && Notification.permission === "granted") {
			if(document.hidden==true){//若APP不為前景頁面，則通知用戶訊息
      			spawnNotification(user+" 向您傳送了圖片","img/icons/icon48x48.png","U-Chat");
      		}
    	}
		scrollMessage();
	});
	//在線列表
	socket.on('add userList', function (user) {
		$('#userSelect').append($('<option></option>').attr('value', user).text(user));
    });
	//在線男女生
	socket.on('people',function(people){
		$('.people').text("目前在線："+people+"人");
	});

    //接收上線訊息
	socket.on('user join',function(user){
		$('#msgcontent').append('<p class="loginmsg">'+user+' 上線了</p>');
		scrollMessage();
	});
	
	//接收下線訊息
	socket.on('user left', function (user) {
        $('#msgcontent').append('<p class="loginmsg">'+user+' 離線了</p>');
        scrollMessage();
		//remove leaved user in selector 
		$('#userSelect').find('[value=\''+user+'\']').remove();
    });
	//登入名稱重複
	socket.on('name repeat',function(){
		alert("這個名字有人使用囉!");
		window.location.reload();
	});
	//與伺服器失去連接
	socket.on('disconnect',function(){
		$('#msgcontent').append('<p class="loginmsg" style="color:red">與伺服器失去連接...</p>');

	});
	//與伺服器連接失敗
	socket.on('error',function(){
		$('#msgcontent').append('<p class="loginmsg" style="color:red">與伺服器連接失敗</p>');
	});
	//重新連接伺服器訊息
	socket.on('reconnecting',function(){
		$('#msgcontent').append('<p class="loginmsg" style="color:red">正在重新連接伺服器...</p>');
	});
	//成功重新連接伺服器訊息
	socket.on('reconnect',function(){
		$('#msgcontent').append('<p class="loginmsg" style="color:red">成功重新連接伺服器!</p>');
	});
	//重新連接發生錯誤
	socket.on('reconnect_error',function(){
		$('#msgcontent').append('<p class="loginmsg" style="color:red">重新連接發生錯誤!</p>');
	});
	//重新連接失敗
	socket.on('reconnect_failed',function(){
		$('#msgcontent').append('<p class="loginmsg" style="color:red">重新連接失敗!</p>');
	});

	/****************function******************/
	// 傳輸訊息
	function sendMessage(){
		user.message = $('#input').val();
		if(user.message != ""){ 
			//公開聊天
			if(receiveUser=='all'){
				$('#msgcontent').append('<div class="mySend"><div class="myDialogue"><li>'+ user.name +": " +user.message+'</li><div class="myArrow"></div></div>'+'<p class="sendTime">'+nowTime()+'</p></div>');
				$('#input').val("");//清空輸入列
				if(user.bighead!=""){//若有大頭照
					socket.emit('message',receiveUser,user.name,user.message,nowTime(),user.bighead);
				}else{
					socket.emit('message',receiveUser,user.name,user.message,nowTime());//傳輸這項訊息到後端
				}
				
			}
			//私人聊天
			else{
				$('#msgcontent').append('<div class="mySend"><div class="myDialogue"><li>'+"[密語]"+receiveUser+ ": "+user.message+'</li><div class="myArrow"></div></div>'+'<p class="sendTime">'+nowTime()+'</p></div>');
				$('#input').val("");//清空輸入列
				if(user.bighead!=""){
					socket.emit('message',receiveUser,user.name,user.message,nowTime(),user.bighead);
				}else{
					socket.emit('message',receiveUser,user.name,user.message,nowTime());
				}
			}
			scrollMessage();
		}
	}
	//接收訊息
	function recieveMessage(user, receiveUser, message, time, bighead){
		//公開聊天
		if(receiveUser == 'all'){
			if(bighead != null){//有大頭貼的訊息
				$('#msgcontent').append([$('<img>', {class:"otherBighead" ,src: bighead})],'<div class="otherSend"><div class="otherDialogue"><li>'+ user +": " +message+'</li><div class="otherArrow"></div></div>'+'<p class="othersendTime">'+time+'</p></div>');
			}else{//無大頭貼的訊息
				$('#msgcontent').append('<div class="otherSend"><div class="otherDialogue"><li>'+ user +": " +message+'</li><div class="otherArrow"></div></div>'+'<p class="othersendTime">'+time+'</p></div>');
				$('.otherSend').css("clear","both");
			}
		}
		//私人聊天
		else{
			if(bighead != null){
				$('#msgcontent').append([$('<img>', {class:"otherBighead" ,src: bighead})],'<div class="otherSend"><div class="otherDialogue"><li>'+"[密語]"+user+ ": "+message+'</li><div class="otherArrow"></div></div>'+'<p class="othersendTime">'+time+'</p></div>');
			}else{
				$('#msgcontent').append('<div class="otherSend"><div class="otherDialogue"><li>'+"[密語]"+user+ ": "+message+'</li><div class="otherArrow"></div></div>'+'<p class="othersendTime">'+time+'</p></div>');
				$('.otherSend').css("clear","both");
			}
		}
		scrollMessage();
		return true;//測試用
	}
	//取得送出訊息的時間
	function nowTime(){
		var time = new Date();
		var hr   = time.getHours();
		var min  = time.getMinutes();
		if(time.getHours()<=9){
			hr="0"+time.getHours();
		}
		if(time.getMinutes()<=9){
			min="0"+time.getMinutes();
		}
		var sendTime=hr+":"+min;
		return sendTime;
	}
	//上傳圖片
	function readUpload(input) {
		if ( input.files && input.files[0] ) {
			var FR= new FileReader();
			FR.onload = function(e) {
				if(receiveUser=='all'){
					$('#msgcontent').append('<p class="sendImg">'+ user.name + ":" +'</p>',[$('<img>', {class:"myImg" ,src: e.target.result})],'<p class="sendTime">'+nowTime()+'</p>');
				}
				else{
					$('#msgcontent').append('<p class="sendImg">[密語]給 '+ receiveUser + " :" +'</p>',[$('<img>', {class:"myImg" ,src: e.target.result})],'<p class="sendTime">'+nowTime()+'</p>');
				}
				socket.emit('image',user.name, receiveUser, e.target.result,nowTime(),bighead);
			};       
			FR.readAsDataURL( input.files[0] );
		}
		scrollMessage();
		return true;//測試用
	}
	//上傳大頭貼
	function bigheadUpload(input){
		if ( input.files && input.files[0] ) {
			var FR = new FileReader();
			FR.onload = function(e){
				$('#bigheadimg').prepend([$('<img>', {class:"mybighead" ,src: e.target.result})]);
				user.bighead=e.target.result;
			};
			FR.readAsDataURL( input.files[0] );
		}
		return true;//測試用
	}
	//更換背景
	function backgroundUpload(input){
	if ( input.files && input.files[0] ) {
		var FR = new FileReader();
		FR.onload = function(e){
			$('#msgcontent').css('background-image','url(\''+e.target.result+'\')');
			$('#msgcontent').css('background-size','cover');
		};
		FR.readAsDataURL( input.files[0] );
	}
	return true;//測試用
	}
	//視窗自動滾動
	function scrollMessage(){
		$('#msgcontent').stop().animate({scrollTop: $("#msgcontent")[0].scrollHeight}, 800);
	}
	//通知功能
	function spawnNotification(theBody,theIcon,theTitle) {
		var options = {
		    body: theBody,
		    icon: theIcon
		}
		var n = new Notification(theTitle,options);
	}
});
