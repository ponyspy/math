$(document).ready(function() {

	$(document).on('paste','[contenteditable]',function(e) {
		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
		window.document.execCommand('insertText', false, text);
	});

	$('.editor').each( function(index, element) {
		$(element).wysiwyg({
				class: 'editor',
				toolbar: 'top-selection',
				maxImageSize: [600, 400],
				buttons: {
				insertlink: {
						title: 'Insert link',
						image: '\uf08e',
				},
				insertimage: index === 0 ? false : {
						title: 'Insert image',
						image: '\uf030', // <img src="path/to/image.png" width="16" height="16" alt="" />
						//showstatic: true,    // wanted on the toolbar
						// showselection: index == 2 ? true : false    // wanted on selection
				},
				 bold: {
							title: 'Bold (Ctrl+B)',
							image: '\uf032',
							hotkey: 'b'
					},
					italic: {
							title: 'Italic (Ctrl+I)',
							image: '\uf033',
							hotkey: 'i'
					},
					underline: {
							title: 'Underline (Ctrl+U)',
							image: '\uf0cd',
							hotkey: 'u'
					},
					alignleft: {
							title: 'Left',
							image: '\uf036', // <img src="path/to/image.png" width="16" height="16" alt="" />
							//showstatic: true,    // wanted on the toolbar
							// showselection: false    // wanted on selection
					},
					aligncenter: {
							title: 'Center',
							image: '\uf037', // <img src="path/to/image.png" width="16" height="16" alt="" />
							//showstatic: true,    // wanted on the toolbar
							// showselection: false    // wanted on selection
					},
					alignright: {
							title: 'Right',
							image: '\uf038', // <img src="path/to/image.png" width="16" height="16" alt="" />
							//showstatic: true,    // wanted on the toolbar
							// showselection: false    // wanted on selection
					},
					orderedList: {
							title: 'Ordered list',
							image: '\uf0cb', // <img src="path/to/image.png" width="16" height="16" alt="" />
							//showstatic: true,    // wanted on the toolbar
							// showselection: false    // wanted on selection
					},
					unorderedList: {
							title: 'Unordered list',
							image: '\uf0ca', // <img src="path/to/image.png" width="16" height="16" alt="" />
							//showstatic: true,    // wanted on the toolbar
							// showselection: false    // wanted on selection
					},
					header: {
							title: 'Header',
							image: '\uf1dc', // <img src="path/to/image.png" width="16" height="16" alt="" />
							popup: function( $popup, $button ) {
											var list_headers = {
															// Name : Font
															'Заголовок 2' : '<h2>',
															'Заголовок 3' : '<h3>',
													};
											var $list = $('<div/>').addClass('wysiwyg-plugin-list')
																						 .attr('unselectable','on');
											$.each( list_headers, function( name, format ) {
													var $link = $('<a/>').attr('href','#')
																							 .css( 'font-family', format )
																							 .html( name )
																							 .click(function(event) {
																									$(element).wysiwyg('shell').format(format).closePopup();
																									// prevent link-href-#
																									event.stopPropagation();
																									event.preventDefault();
																									return false;
																							});
													$list.append( $link );
											});
											$popup.append( $list );
										 }
							//showstatic: true,    // wanted on the toolbar
							//showselection: false    // wanted on selection
					},
					subscript: {
							title: 'Subscript',
							image: '\uf12c', // <img src="path/to/image.png" width="16" height="16" alt="" />
							//showstatic: true,    // wanted on the toolbar
							// showselection: true    // wanted on selection
					},
					superscript: {
							title: 'Superscript',
							image: '\uf12b', // <img src="path/to/image.png" width="16" height="16" alt="" />
							//showstatic: true,    // wanted on the toolbar
							// showselection: true    // wanted on selection
					},
					removeformat: {
							title: 'Remove format',
							image: '\uf12d'
					},
					preview: {
							title: 'Preview',
							image: '❐',
							click: function($button) {
								window.open('/auth/lecture/preview/' + index, '', 'width=800, height=600, left=200, top=200');
							},
							showstatic: true,
							showselection: true
					},
				},
				submit: {
						title: 'Submit',
						image: '\uf00c'
				},
				// placeholder: 'Type your text here...',
				selectImage: 'Click or drop image',
				placeholderUrl: 'www.example.com',
		});
	});
});