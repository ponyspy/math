$(function() {
	if (window.opener && !window.opener.closed) {
		var parent = window.opener.document;
		var index = +window.location.href.split('/').pop();
		var html = $(parent).find('.wysiwyg-container').eq(index).find('.wysiwyg-editor').clone().removeAttr('contenteditable');

		$('body').append(html).promise().done(function() {
			var head = [
				'<link rel="stylesheet" type="text/css" href="/build/libs/css/jqmath-0.4.3.css">',
				'<script type="text/javascript" src="/build/libs/js/jqmath-etc-0.4.3.min.js">'
			].join('');

			$('head').append(head);
		});
	}
});