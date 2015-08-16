$(document).ready(function() {
	$(window).on('scroll', function(event) {
		$(window).scrollTop() == $(document).height() - $(window).height()
			&& $('.content_item_block').length < 60
			&& $('.content_item_block').slice(0,3).clone().appendTo('.column_main_block');
	});
});