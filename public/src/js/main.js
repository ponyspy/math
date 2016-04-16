$(document).ready(function() {

	// $('.photo_inner').plaxify({'xRange': 140, 'yRange': 140, 'invert': true, 'useTransform': false});
	// $('.rounds_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': false, 'useTransform': false});
	// $('.blocks_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': true, 'useTransform': false});
	// $.plax.enable();

	$(document)
		.on('scroll', function() {
			var factor = 1 + $(window).scrollTop() / $(window).height();

			factor >= 1
				? $('.photo').css('transform', 'scale(' + factor +')')
				: false;
		});

		$('.photo_inner').on('click', function() {
			$('body').animate({
				'scrollTop': $('.content_item').eq(0).offset().top - $('.menu_block').height() - 12
			}, 400);
		});
});