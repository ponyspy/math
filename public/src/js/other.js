$(document).ready(function() {
	var context = {
		skip: 0,
		limit: 20,
		category: window.location.hash === '' ? 'all' : window.location.hash.replace('#','')
	};

	$(window).on('scroll', function(event) {
		$(window).scrollTop() == $(document).height() - $(window).height()
			&& $('.other_item').length < 60
			&& $('.other_item').slice(0,3).clone().appendTo('.studys_other');
	});

	$(window).on('load hashchange', function(event) {
		context.skip = 0;
		context.limit = 20;
		context.category = window.location.hash === '' ? 'all' : window.location.hash.replace('#','');

		var $category_item = $('.' + context.category);
		var index = $category_item.index('.category_item');

		$('.category_item').removeClass('current').eq(index).addClass('current');
		$.post('/other', {context: context}).done(function(data) {
			$('.studys_other').empty().append(data);
			$('.social-likes').socialLikes();
		});
	});
});