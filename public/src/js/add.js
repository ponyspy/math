var parseYouTubeId = function(url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) {
		return match[2];
	} else {
		return '';
	}
};

var dataURItoBlob = function(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
	else
			byteString = unescape(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
};

$(document).ready(function() {

	$('.form_submit').on('click', function() {
		$(this).off();
		var $images = $('.editor').find('img');
		var video = $('input.video').val();
		var images = [];

		$('input.video').val(parseYouTubeId(video));

		$images.each(function(index, el) {
			var $this = $(this);
			var image_id = Date.now().toString();

			images.push({
				id: image_id,
				buffer: $this.attr('src')
			});

			$this.attr('src', image_id).removeAttr('title').removeAttr('alt');
		});

		setTimeout(function() {
			var form_data = new FormData($('form')[0]);

			$images.each(function(index, el) {
				var image_id = $(this).attr('src');

				var image = images.filter(function(image) { return image.id == image_id; })[0];
				var image_blob = dataURItoBlob(image.buffer);

				form_data.append('images', image_blob, image_id);
			});

			$.ajax({
				url: '',
				data: form_data,
				cache: false,
				contentType: false,
				processData: false,
				type: 'POST',
				success: function(data){
					location.reload();
				}
			});
		}, 1000)

	});

	function snakeForward () {
		var $snake = $(this).parent('.snake_outer').children('.snake');
		$snake.first().clone()
			.find('option').prop('selected', false).end()
			.find('.input').val('').end()
			.insertAfter($snake.last());
	}

	function snakeBack () {
		var $snake = $(this).closest('.snake_outer').children('.snake');
		if ($snake.size() == 1) return null;
		$(this).parent('.snake').remove();
	}

	$(document).on('click', '.back', snakeBack);
	$('.forward').on('click', snakeForward);
});