function removeEventListeners() {
	if (keyDownEventListener != null) {
		document.removeEventListener('keydown', keyDownEventListener);
		keyDownEventListener = null;
	}
	if (barEventListener !== null) {
		document.removeEventListener('keydown', barEventListener);
		barEventListener = null;
	}
	if (backEventListener != null) {
		document.removeEventListener('tizenhwkey', backEventListener);
		backEventListener = null;
	}
}

function search() {
	var searchText = $('#searchText').val();
	window.location.href = 'search_result.html?s=' + searchText;
}

function setFocusElement(e) {
	switch (e.keyCode) {
		case TvKeyCode.KEY_ENTER:
			if (document.activeElement.id == 'searchBtn') {
				search();
			}
			break;
		case TvKeyCode.KEY_UP:
			$('#searchText').blur();
			$('#searchText').parent().addClass('ui-focus');
			showKeyboard();
			removeEventListeners();
			document.addEventListener('keydown', setKeyboardAction);
			keyDownEventListener = setKeyboardAction;
			break;
		case TvKeyCode.KEY_DOWN:
			$('#searchBtn').focus();
			break;
	}
}