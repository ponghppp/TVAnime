var text_input = [];

function getBtnByGrid(row, col) {
	return $('.keyboardChoose').children(`div:nth(${col})`).children(`div:nth(${row})`);
}

function getTextByIndex(idx) {
	return $('.chooseTextContainer').children(`div:nth(${idx})`);
}

function getWordsFromDict() {
	$('.chooseTextContainer').html('');
	var input_alphabet = text_input.map(t => t.alphabet).join('');
	if (input_alphabet == '') {
		return;
	}
	var count = 0;
	for (var i = 0; i < words.length; i++) {
		var word = words[i];
		if (word.typing.startsWith(input_alphabet)) {
			count++;
			$('.chooseTextContainer').append(`<div class="chooseText">${word.word}</div>`)
		}
		if (count >= 100) {
			break;
		}
	}
}

function addEventListeners() {
	document.addEventListener('keydown', setupBottomBarAction);
	barEventListener = setupBottomBarAction;

	document.addEventListener('keydown', setFocusElement);
	keyDownEventListener = setFocusElement;

	document.addEventListener('tizenhwkey', backEvent);
	backEventListener = backEvent;
}

function setKeyboardAction(e) {
	var rowIndex = $('.btnActive').index();
	var maxRowIndex = $('.btnActive').parent().children().length - 1;
	var colIndex = $('.btnActive').parent().index();
	var maxColIndex = $('.keyboardChoose').children().length - 1;
	var inputElem = $('#searchText');
	var input = $('#searchText').val();
	var selection = $('.btnActive').text();
	switch (e.keyCode) {
		case TvKeyCode.RETURN:
			hideKeyboard();
			$('#searchText').parent().removeClass('ui-focus');
			addEventListeners();
		case TvKeyCode.KEY_ENTER:
			if (!isNaN(parseInt(selection))) {
				inputElem.val(input + selection);
				return;
			}
			if ($('.btnActive').attr('id') == 'search') {
				hideKeyboard();
				$('#searchText').parent().removeClass('ui-focus');
				addEventListeners();
				search();
				return;
			}
			if ($('.btnActive').parent().attr('class') == 'chooseTextContainer') {
				inputElem.val(input + selection);
				text_input = [];
				$('.chooseTextContainer').html('');
				$('.inputText').html('');
				$('.btnActive').toggleClass('btnActive');
				getBtnByGrid(0, 0).toggleClass('btnActive');
				return
			}
			if ($('.btnActive').attr('id') == 'chg') {
				hideKeyboard();
				$('#searchText').parent().removeClass('ui-focus');
				addEventListeners();
				$('#searchText').focus();
				return;
			}
			if ($('.btnActive').attr('id') == 'del') {
				if (text_input.length == 0) {
					inputElem.val(input.substring(0, input.length - 1));
					return;
				}
				text_input.pop();
				$('.inputText').html(text_input.map(t => t.word).join(''));
				getWordsFromDict();
				return;
			}
			if (text_input.length < 2) {
				text_input.push({ word: selection, alphabet: $('.btnActive').attr('id') });
				$('.inputText').html(text_input.map(t => t.word).join(''));
				getWordsFromDict();
			}
			break;
		case TvKeyCode.KEY_UP:
			if (colIndex == 0 && $('.chooseText').length > 0) {
				$('.btnActive').toggleClass('btnActive');
				$('.chooseText:nth(0)').toggleClass('btnActive');
				return
			}
			var nextColIndex = colIndex - 1 < 0 ? maxColIndex : colIndex - 1
			var nextRowMaxIndex = $('.keyboardChoose').children(`div:nth(${nextColIndex})`).children().length - 1;
			rowIndex = Math.min(rowIndex, nextRowMaxIndex);
			var nextBtn = getBtnByGrid(rowIndex, nextColIndex);
			$('.btnActive').toggleClass('btnActive');
			nextBtn.toggleClass('btnActive');
			break;
		case TvKeyCode.KEY_DOWN:
			var nextColIndex = colIndex + 1 > maxColIndex ? 0 : colIndex + 1
			var nextRowMaxIndex = $('.keyboardChoose').children(`div:nth(${nextColIndex})`).children().length - 1;
			rowIndex = Math.min(rowIndex, nextRowMaxIndex);
			var nextBtn = getBtnByGrid(rowIndex, nextColIndex);
			$('.btnActive').toggleClass('btnActive');
			nextBtn.toggleClass('btnActive');
			break;
		case TvKeyCode.KEY_LEFT:
			if ($('.btnActive').parent().attr('class') == 'chooseTextContainer') {
				var nextIndex = Math.max(0, rowIndex - 1);
				var nextText = getTextByIndex(nextIndex);
				$('.btnActive').toggleClass('btnActive');
				nextText.toggleClass('btnActive');
				return
			}
			var nextRowIndex = rowIndex - 1 < 0 ? maxRowIndex : rowIndex - 1
			var nextBtn = getBtnByGrid(nextRowIndex, colIndex);
			$('.btnActive').toggleClass('btnActive');
			nextBtn.toggleClass('btnActive');
			break;
		case TvKeyCode.KEY_RIGHT:
			if ($('.btnActive').parent().attr('class') == 'chooseTextContainer') {
				var nextIndex = Math.min(maxRowIndex, rowIndex + 1);
				var nextText = getTextByIndex(nextIndex);
				$('.btnActive').toggleClass('btnActive');
				nextText.toggleClass('btnActive');
				return
			}
			var nextRowIndex = rowIndex + 1 > maxRowIndex ? 0 : rowIndex + 1
			var nextBtn = getBtnByGrid(nextRowIndex, colIndex);
			$('.btnActive').toggleClass('btnActive');
			nextBtn.toggleClass('btnActive');
			break;
	}
}

//window.addEventListener('keydown', setKeyboardAction);