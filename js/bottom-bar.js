var bottomBarItems = [
	{ name: '列表', action: 'index' },
	{ name: '記錄', action: 'record' },
	{ name: '新番', action: 'year' },
	{ name: '搜尋', action: 'search' }
];

var barEventListener = null;

function setupBottomBarAction(e) {
	var currentIndex = bottomBarItems.findIndex(i => window.location.href.includes(i.action));

	switch (e.keyCode) {
		case TvKeyCode.KEY_LEFT:
			currentIndex = Math.max(0, currentIndex - 1);
			var action = bottomBarItems[currentIndex].action;
			if (!window.location.href.includes(action)) {
				window.location.href = action + '.html';
			}
			break;
		case TvKeyCode.KEY_RIGHT:
			currentIndex = Math.min(currentIndex + 1, bottomBarItems.length - 1);
			var action = bottomBarItems[currentIndex].action;
			if (!window.location.href.includes(action)) {
				window.location.href = action + '.html';
			}
			break;
	}
}

function createBottomBar() {
	var items = [];
	for (var i = 0; i < bottomBarItems.length; i++) {
		var activeClass = 'ui-btn-active ui-state-persist ui-btn ui-btn-inline ui-btn-up-a';
		var inactiveClass = 'ui-btn ui-btn-up-a ui-btn-inline';
		var isActive = window.location.href.includes(bottomBarItems[i].action);
		var item = `<li class="ui-block-${String.fromCharCode(97 + Math.min(i, 25))}"><a id="${bottomBarItems[i].action}" class="${isActive ? activeClass : inactiveClass}" style="box-shadow: 0 0;" data-corners="false"
		data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-theme="a" data-inline="true"
		class="ui-btn ui-btn-up-a ui-btn-inline"><span class="ui-btn-inner"><span
		class="ui-btn-text">${bottomBarItems[i].name}</span></span></a></li>`
		items.push(item);
	}
	fetch('footer.html').then((res) => res.text()).then(function (footer) {
		footer = footer.replace('<ul></ul>', `<ul class="ui-grid-${String.fromCharCode(95 + Math.max(2, Math.min(bottomBarItems.length, 25)))}">${items.join(' ')}</ul>`)
		$('#foo').append(footer);
	})
}

$(document).ready(function () {
	createBottomBar();
	document.addEventListener( 'keydown', setupBottomBarAction );
	barEventListener = setupBottomBarAction;
});

$(document).unload( function () {
	if ( barEventListener !== null ) {
		document.removeEventListener( 'keydown', barEventListener );
		barEventListener = null;
	}
});