$(document).ready(function() {
	$('.panel_open').on('click', function() {
		$(this).toggleClass('active');
		$('.content_body_block').toggleClass('open');
		$('.body').toggleClass('stop_scroll');
	});

	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.column_left_block').on('mousemove', function(e) {
			var $this = $(this);

			var percent = e.clientY / $this.height() * 1.1 - 0.25;
			$this.scrollTop($this.children('.left_inner').height() * percent);
		});
	}
});