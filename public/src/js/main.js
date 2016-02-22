$(document).ready(function() {

	// $('.photo_inner').plaxify({'xRange': 140, 'yRange': 140, 'invert': true, 'useTransform': false});
	// $('.rounds_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': false, 'useTransform': false});
	// $('.blocks_group').plaxify({'xRange': 40, 'yRange': 0, 'invert': true, 'useTransform': false});
	// $.plax.enable();

	$(document)
		.on('scroll', function() {
			$(window).scrollTop() + $(window).height() + 600 >= $(document).height()
				? $('.other').slice(0, 6).clone().insertAfter('.other:last')
				: false;
		});

		$('.desc_select').on('click', function() {
			var index = $(this).index('.desc_select');

			$('.desc_select').removeClass('active').filter(this).addClass('active');
			$('.item_desc').removeClass('active').eq(index).addClass('active');
		});

		$('.photo_inner').on('click', function() {
			$('body').animate({
				'scrollTop': $('.content_item').eq(0).offset().top - $('.menu_block').height() - 15
			}, 400);
		});
});