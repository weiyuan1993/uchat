var express = require('express');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var app = express();

var currentUsers = [];
var currentSockets = [];

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
io = io.listen(server);
server.listen(4000);

var people=0;

//使用者連線時
io.sockets.on('connection',function(socket){ 
	//新使用者登入
	socket.on('new user',function(name,sex){
		//確認名字是否重複
		if(currentUsers.indexOf(name)==-1){
			currentUsers.push(name);
			currentSockets.push(socket);
			socket.broadcast.emit('user join', name);
			socket.broadcast.emit('add userList', name);
			people++;
			io.emit('people',people);
			console.log(name+" "+sex+"成功登入");
		}else{
			socket.emit('name repeat');//名稱重複
		}
	});
	//傳輸目前在線使用者
	for(var i=0 ; i<=currentUsers.length-1; i++){
		socket.emit('add userList', currentUsers[i]);
	}

  	socket.on('message', function( receiveName,userName ,message,time,bighead){
		if(receiveName == 'all'){  //公開聊天
			socket.broadcast.emit('message', userName, receiveName, message,time,bighead);
		}
		else{  //私人聊天
			currentSockets[currentUsers.indexOf(receiveName)].emit('message', userName, receiveName, message,time,bighead);
		}
  	});

  	socket.on('image',function(user,receiveUser,image,time,bighead){
  		if(receiveUser == 'all'){  //公開聊天
			socket.broadcast.emit('image', user, receiveUser, image,time,bighead);
		}
		else{  //私人聊天
			currentSockets[currentUsers.indexOf(receiveUser)].emit('image', user, receiveUser, image, time,bighead);
		}
  	});
  	//離線時
	socket.on('disconnect', function(){
		if(currentSockets.indexOf(socket)!=-1){
			//when disconnect username doesn't null, show user left message
			//problem: sometimes client receive null left message, and nobody was disconnect.
			if(currentUsers[currentSockets.indexOf(socket)] != null){
				people--;
				io.emit('people',people);
				io.emit('user left', currentUsers[currentSockets.indexOf(socket)]);
			}
			//remove leaved user's name and socket
			currentUsers.splice(currentSockets.indexOf(socket),1);
			currentSockets.splice(currentSockets.indexOf(socket),1);
		}
  	});
});

