$(document).ready(function() {
	// var search = {
	// 	val: '', buf: '',
	// 	checkResult: function() {
	// 		if (this.buf != this.val) {
	// 			this.buf = this.val;
	// 			this.getResult.call(search, this.val);
	// 		}
	// 	},
	// 	getResult: function (result) {
	// 		$.post('/search', {search: result}).done(function(data) {
	// 			data.events.length == 0 && data.exhibits.length == 0
	// 				? $('.search_result').hide()
	// 				: $('.search_result').show();

	// 			$('.search_context').hide().children('.context_results_block').empty();

	// 			data.exhibits.forEach(function(exhibit) {
	// 				var context_result = $('<a/>', {'class': 'context_result', 'href': '/exhibits/' + exhibit._id, 'text': exhibit.title[0].value});
	// 				$('.search_context.exhibits').show().children('.context_results_block').append(context_result);
	// 			});

	// 			data.events.forEach(function(event) {
	// 				var context_result = $('<a/>', {'class': 'context_result', 'href': '/events/' + event.type + '/' + event._id, 'text': event.title[0].value});
	// 				$('.search_context.events').show().children('.context_results_block').append(context_result);
	// 			});
	// 		});
	// 	}
	// };

	// $('.search_input')
	// .on('keyup change', function(event) {
	// 	search.val = $(this).val();
	// })
	// .on('focusin', function(event) {
	// 	search.interval = setInterval(function() {
	// 		search.checkResult.call(search);
	// 	}, 1000);
	// })
	// .on('focusout', function(event) {
	// 	clearInterval(search.interval);
	// });


	$('.search_input').on('focusin', function(event) {
		$('.content_block').hide();
		$('.results').fadeIn(300);
		$('.search_input').addClass('focus');
	});

	$(document)
		.on('mouseup.search', function(event) {
			if (!/item_block|item_title|item_description|search_input|link|preview_block/.test(event.target.className)) {
				$('.content_block').fadeIn(300);
				$('.results').hide();
				$('.search_input').removeClass('focus');
			}
		})
		.on('mouseup.player', function(event) {
			var container = $('.preview_video');

			if (!container.is(event.target)
					&& container.has(event.target).length === 0)
			{
					$('.preview_block').hide().empty();
					$('.main_block').removeClass('preview');
					$('body').removeClass('stop_scroll');
			}
		})
		.on('keyup', function(event) {
			if (event.shiftKey && event.which == 70) {
				$('.search_input').focus();
			} else if (event.which == 27) {
				$('.search_input').blur();
				$(this).trigger('mouseup.search');
			}
		})
		.on('click', '.link', function() {
			if ($(this).hasClass('video')) {
				var id = $(this).attr('video_id');
				var url = 'https://www.youtube.com/embed/' + id;
				var video = $('<iframe>', {'class': 'preview_video', 'width':'720px', 'height': '400px', 'frameborder': 0, 'allowfullscreen': true, 'src': url});

				$('.preview_block').empty().append(video).show();
				$('.main_block').addClass('preview');
				$('body').addClass('stop_scroll');
			}

			if ($(this).hasClass('pdf')) {
				var path = $(this).attr('file_path');
				window.open(path,'_blank');
				// window.location.href = path;
			}
		});
});