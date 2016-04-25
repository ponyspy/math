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

	$(window).on('load', function() {
		if (window.location.hash == '#send') {
			var $result = $('<div/>', {'class': 'form_result', 'text': 'Письмо отправлено'})
			$('.content_block').empty().append($result);
		}
	});

	$('.file').on('change', function() {
		$('.form_file').addClass('change');
		$('.form_file').on('click', function(e) {
			var $file = $('.file');
			$file.replaceWith($file.val('').clone(true));
			$('.form_file').removeClass('change');
			$(this).off();
			return false;
		});
	});

});