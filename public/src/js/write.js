var validate = {
	email: 	function (email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
};

$(document).ready(function() {
	$('.form_submit').on('click', function() {
		var email = $('.form_email').val();
		if (validate.email(email)) {
			$('.description_form').val($('.description_input').text());
			$('form').submit();
		} else {
			$('.form_email').css('border-bottom', '1px solid red');
		}
	});


	$('.description_input').focusout(function(){
		var element = $(this);
		if (!element.text().replace(' ', '').length) {
				element.empty();
		}
	});

});