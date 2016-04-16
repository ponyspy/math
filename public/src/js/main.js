$(document).ready(function() {

	// $('.photo_inner').plaxify({'xRange': 140, 'yRange': 140, 'invert': true, 'useTransform': false});
	// $('.rounds_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': false, 'useTransform': false});
	// $('.blocks_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': true, 'useTransform': false});
	// $.plax.enable();

	var $photo_inner = $('.photo_inner');
	var $photo = $('.photo');

	$(document)
		.on('scroll', function() {
			var factor = -100 * $(window).scrollTop() / ($(window).height() + $photo_inner.height())

			if (factor <= 0) {
				factor = factor + '%';

				$photo.css({'top': factor, 'bottom': factor, 'left': factor, 'right': factor});
			}
		});

		$('.photo_inner').on('click', function() {
			$('body').animate({
				'scrollTop': $('.content_item').eq(0).offset().top - $('.menu_block').height() - 12
			}, 400);
		});
});