$(function(){
	var isMobile = {
			Android: function() {
				return navigator.userAgent.match(/Android/i);
			},
			BlackBerry: function() {
				return navigator.userAgent.match(/BlackBerry/i);
			},
			iOS: function() {
				return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			},
			Opera: function() {
				return navigator.userAgent.match(/Opera Mini/i);
			},
			Windows: function() {
				return navigator.userAgent.match(/IEMobile/i);
			},
			any: function() {
				return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			}
		};
		if(isMobile.any()){
			$('#inputdiv').css('width','60%');
			$('#senddiv').css('width','20%');
			$('#uploaddiv').css('width','20%');
			$('#login').css('width','100%');

		}
		else{
			
			$('.otherImg').css('max-width','30%');
			$('.myImg').css('max-width','30%');
		}
})
