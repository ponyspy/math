$(document).ready(function() {
	$('.panel_open').on('click', function() {
		$('.content_body_block').toggleClass('open');
	});

	$('.column_left_block').on('mousemove', function(e) {
		var $this = $(this);

		$this.scrollTop(e.pageY - $this.height() / 1.6);
	});
});