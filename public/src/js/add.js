var parseYouTubeId = function(url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length == 11) {
		return match[2];
	} else {
	  return '';
	}
}

$(document).ready(function() {
	$('form').on('submit', function(event) {
		var video = $('input.video').val();

		$('input.video').val(parseYouTubeId(video));

		return true;
	});
});