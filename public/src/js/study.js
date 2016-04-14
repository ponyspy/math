$(document).ready(function() {
	$('.panel_open').on('click', function() {
		$(this).toggleClass('active');
		$('.content_body_block').toggleClass('open');
	});

	$('.column_left_block').on('mousemove', function(e) {
		var $this = $(this);

    var percent = e.pageY / $this.height() * 1.1 - 0.25;
    $this.scrollTop($this.children('.left_inner').height() * percent);
	});
});