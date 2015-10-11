$(document).ready(function() {

	$(document).on('paste','[contenteditable]',function(e) {
		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
		window.document.execCommand('insertText', false, text);
	});

	$('.editor').each( function(index, element) {
		$(element).wysiwyg({
				classes: 'editor',
				toolbar: 'top-selection',
				buttons: {
				insertlink: {
						title: 'Insert link',
						image: '\uf08e',
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
					removeformat: {
							title: 'Remove format',
							image: '\uf12d'
					},
				},
				submit: {
						title: 'Submit',
						image: '\uf00c'
				},
				// placeholder: 'Type your text here...',
				placeholderUrl: 'www.example.com',
		});
	});
});