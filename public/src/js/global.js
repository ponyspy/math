$(document).ready(function() {
	$(document).on('touchmove', 'body.stop_scroll', false);

	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/search', {search: result}).done(function(data) {
				$('.search_input').val() === ''
					? $('.search_results').find('.search_title').text('Что будем искать?')
					: $('.search_results').find('.search_title').text('Ничего не найдено');

				if (data.studys === '') {
					$('.search_results')
						.find('.search_title').show().end()
						.find('.search_items').empty().end()
						.find('.search_nav').hide();

					return false;
				}

				$('.search_results')
					.find('.search_title').hide().end()
					.find('.search_nav').show().end()
					.find('.search_items').empty().append(data.studys).end()
					.find('.social-likes').socialLikes().end()
					.find('.categorys_block').hide().empty();

				if (data.categorys.length > 0) {
					$('.search_results').find('.categorys_block').show();
					data.categorys.forEach(function(category) {
						var $category = $('<div/>', {'class': 'nav_item ' + category._id, 'text': category.title});
						$('.search_results').find('.categorys_block').append($category);
					});
				}
			});
		}
	};

	$('.search_input')
		.on('keyup change', function(event) {
			search.val = $(this).val();
		})
		.on('focusin', function(event) {
			search.interval = setInterval(function() {
				search.checkResult.call(search);
			}, 1000);
		})
		.on('focusout', function(event) {
			clearInterval(search.interval);
		});


	$('.search_input').on('focusin', function(event) {
		$(document).on('keyup.key_search', function(event) {
			if (event.which == 27) {
					if ($('.search_input').val() === '') {
						$('.search').trigger('click');
						$(document).off('keyup.key_search');
					} else {
						$('.search_input').val('').trigger('keyup');
					}
			}
		});
	});

	if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		$('.item_themes').on('mousemove', function(e) {
			var $this = $(this).children('.themes_outer');

			var percent = (e.pageX - $this.offset().left) / $this.width() * 1.1 - 0.25;
			$this.scrollLeft($this.children('.themes_inner').width() * percent);
		});
	}

	$('.logo').on('click', function() {
		$('.menu_themes').toggleClass('active');
		$('.panel_open').hide();
	});

	$('.search').on('click', function() {
		$('.logo').toggleClass('hide');
		if ($('.menu_search').hasClass('active')) {
			$('.menu_search').toggleClass('active').children('.search_input').blur();
			$('.search_results').fadeOut(300);
			$('.panel_open').removeAttr('style');
			$('body').removeClass('stop_scroll');
		} else {
			$('.menu_themes').removeClass('active');
			$('.menu_search').toggleClass('active').children('.search_input').focus();
			$('.search_results').fadeIn(300);
			$('.panel_open').hide();
			$('body').addClass('stop_scroll');
		}
	});

	$('.share').on('click', function() {
		$('.right_drop').toggleClass('active');
	});

	$('.mail').on('click', function(event) {
		window.open('/write', '', 'width=640, height=580, left=200, top=100');

		return false;
	});

	$(document)
		.on('scroll', function() {
			$('.right_drop').removeClass('active');
			$('.menu_themes').removeClass('active');
			$('.panel_open').removeAttr('style');
		})
		.on('mouseup touchend', function(event) {
				if ($(event.target).closest('.menu_block, .search_inner, .preview_video, .preview_pdf').length) return;

				$('.logo').removeClass('hide');
				$('.menu_themes, .menu_search').removeClass('active');
				$('.search_results').fadeOut(300);
				$('.panel_open').removeAttr('style');
				$('.preview_block').fadeOut(300).find('.preview_video, .preview_pdf').empty();
				$('body').removeClass('stop_scroll');

				event.stopPropagation();
		})
		.on('mousemove', '.link.pdf', function(event) {
			var x = (event.clientX + 20),
					y = (event.clientY + 20);

			$(this).children('.tooltip').css({top: y, left: x});
		})
		.on('click', '.link', function() {
			if ($(this).hasClass('video')) {
				var id = $(this).attr('video_id');
				var url = 'https://www.youtube.com/embed/' + id;
				var video = $('<iframe>', {'class': 'video', 'frameborder': 0, 'allowfullscreen': true, 'src': url});

				$(this).parent().children('.pdf').clone().appendTo('.preview_pdf');

				$('.preview_video').empty().append(video).promise().done(function() {
					$('.preview_block').delay(100).fadeIn(300);
				});
				$('body').addClass('stop_scroll');
			}

			if ($(this).hasClass('pdf')) {
				var path = $(this).attr('file_path');
				window.open(path, '_blank');
			}
		})
		.on('click', '.search_nav .nav_item', function() {
			var type = $(this).attr('class').split(' ')[1];
			$('.search_nav .nav_item').removeClass('current');
			$(this).addClass('current');
			type == 'all'
				? $('.search_items').children('.search_item').show()
				: $('.search_items').children('.search_item').show().not('.' + type).hide();
		});
});