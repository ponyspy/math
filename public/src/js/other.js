$(document).ready(function() {
	var context = {
		skip: 0,
		limit: 20,
		category: window.location.hash === '' ? 'all' : window.location.hash.replace('#','')
	};

	function scrollLoader(event) {
		if ($(window).scrollTop() + $(window).height() + 600 >= $(document).height()) {
			$(window).off('scroll');
			$.ajax({url: '/other', method: 'POST', data: {context: context}, async: false }).done(function(data) {
				if (data !== 'end') {
					$('.studys_other').append(data).find('.social-likes').socialLikes();
					context.skip += 10;
					$(window).on('scroll', scrollLoader);
				}
			});
		}
	}

	$(window)
		.on('scroll', scrollLoader)
		.on('load hashchange', function(event) {
			context.skip = 0;
			context.limit = 20;
			context.category = window.location.hash === '' ? 'all' : window.location.hash.replace('#','');

			$('.category_item').removeClass('current');
			$('.category_item.' + context.category).addClass('current');

			$.ajax({url: '/other', method: 'POST', data: {context: context}, async: false }).done(function(data) {
				if (data !== 'end') {
					var elems = $(data);
					context.skip = elems.length;

					$('.studys_other').empty().append(elems).find('.social-likes').socialLikes();
					$(window).on('scroll', scrollLoader);
				}
			});
		});
});