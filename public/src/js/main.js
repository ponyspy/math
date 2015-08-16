$(document).ready(function() {
	var context = {
		skip: 12,
		types: [],
		categorys: []
	};

	var $container = $('.content_outer_block');
	var $column_main = $('.column_main_inner');
	var news_stamp = document.getElementsByClassName('content_news_block')[0];

	$container.imagesLoaded(function() {
		$container.masonry({
			columnWidth: 60,
			gutter: 20,
			itemSelector: '.event',
			isInitLayout: false
		}).masonry('stamp', news_stamp).masonry('layout').css('opacity', 1);

		if (!window.history.state || (window.history.state.types.length == 0 && window.history.state.categorys.length == 0)) {
			window.history.pushState(context, 'context');
		} else {
			context = window.history.state;
			context.types.forEach(function(item) {
				$('.' + item).addClass('selected').data('clicked', true);
			});
			context.categorys.forEach(function(item) {
				$('.' + item).addClass('selected').data('clicked', true);
			});
			getData();
		}
	});

	function scrollLoad(event) {

		var outer_offset_bottom = $container.offset().top + $container.height();
		var column_height = $column_main.height();

		if (outer_offset_bottom - column_height <= $column_main.scrollTop()) {
			$column_main.off('scroll.load').promise().done(function() {
				$.ajax({ url: '/', method: 'POST', async: false, data: {context: context, skip: context.skip, limit: 6} }).done(function(elems) {

					if (elems != 'out') {
						$elems = $(elems);
						$container.append($elems).masonry('appended', $elems).imagesLoaded(function() {
							context.skip+= 6;
							$container.masonry('layout');
							$column_main.on('scroll.load', scrollLoad);
						});
					}
				});
			});
		}
	};

	function getData() {
		var current_elems = document.getElementsByClassName('event');

		$column_main.off('scroll.load').promise().done(function() {
			$.ajax({url: '/', method: 'POST', data: {context: context, skip: 0, limit: 12}, async: false }).done(function(elems) {
				if (elems != 'out') {
					$elems = $(elems);
					$container.masonry('remove', current_elems).append($elems).masonry('appended', $elems).imagesLoaded(function() {
						$container.masonry('layout');
						$column_main.on('scroll.load', scrollLoad);
					});
				} else {
					$container.masonry('remove', current_elems).masonry('layout');
				}
			});
		});
	}

	function clickLoader(event) {
		context.skip = 12;
		var context_item = $(this).closest('.content_navigate_block').attr('class').split(' ')[1];
		var nav_item = $(this).attr('class').split(' ')[1];

		if (context[context_item].indexOf(nav_item) !== -1) context[context_item].splice(context[context_item].indexOf(nav_item), 1);
		else context[context_item].push(nav_item);

		getData();
		window.history.replaceState(context, 'context');
	}

	$column_main.on('scroll.load', scrollLoad);
	$('.navigate_item').on('click', clickLoader);
});