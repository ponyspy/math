$(document).ready(function() {
	$('.menu_block').on('click', function() {
		$('.content_body_block').toggleClass('close');
	});


		var deltaY = 0;
		var h = $('.column_left_block')[0].scrollHeight;

		$('.column_left_block')
			.on('mousemove', function(e) {
				var y = e.clientY - h / 2;
				deltaY = y * 0.1;
			})
			.on('blur mouseleave', function(e) {
				deltaY = 0;
			});

		(function step() {
			if (deltaY) {
				$('.column_left_block').scrollTop(function(i, v) {
					return v + deltaY;
				});
			}

			requestAnimationFrame(step);
		})();


	// $(document).on('scroll', function(e) {
	// 	$('.column_left_block').scrollTop($(this).scrollTop() * 0.5);
	// });
});