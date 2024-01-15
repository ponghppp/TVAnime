var words = [];

function getQuickDict() {
	fetch('keyboard/ms_quick.dict.txt').then((res) => res.text()).then(function (dict) {
		words = dict.split('\r\n').map(w => ({ word: w.split('\t')[0], typing: w.split('\t')[1] }));
	});
}

function createKeyboard() {
  fetch('keyboard/keyboard.html').then((res) => res.text()).then(function (keyboard) {
		$('#foo').append(keyboard);
    setTimeout(() => {
      $('.chooseTextContainer').width(document.body.clientWidth * 0.8)
      $('.keyboardContainer').css('padding-bottom', $('#footer').height() + 20);
    }, 500);
	})
}

function hideKeyboard() {
  $('.keyboardContainer').css('opacity', 0);
}

function showKeyboard() {
  $('.keyboardContainer').css('opacity', 1);
}

window.onload = function () {
  createKeyboard();
  getQuickDict();
}