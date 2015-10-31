$(document).ready(function() {
	$('.a_books').on('click', function() {
		$(this).toggleClass('clicked');

		$(this).data('clicked', !$(this).data('clicked'));

		if ($(this).data('clicked')) {
			$('.content_desc').eq(1).removeClass('hidden');
			$('.content_desc').eq(0).addClass('hidden');
		} else {
			$('.content_desc').eq(0).removeClass('hidden');
			$('.content_desc').eq(1).addClass('hidden');
		}
	});
});