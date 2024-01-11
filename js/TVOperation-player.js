
var Main = {};
var Player;
var keyDownEventListener = null;

// called when application was loaded
Main.onLoad = function () {
	console.log("Main.onLoad()");

	// enabling media keys
	setTimeout(function (e) {
		Main.enableMediaKeys();
	}, 100);
	//

	// setup handler to key events
	document.addEventListener('keydown', keyDownActions);
	keyDownEventListener = keyDownActions;
}

$(window).on('beforeunload', function () {
	if (tizen.filesystem.listDirectory) {
		var success = function (s) {
			var dump = function () { }
			for (var i = 0; i < s.length; i++) {
				tizen.filesystem.deleteFile('downloads/' + s[i], dump, dump);
			}
		}
		var error = function (e) {
			console.log(e);
			logError(e);
		}
		tizen.filesystem.listDirectory('downloads', success, error);
	}
});

// called when application has closed
Main.onUnload = function () {
	console.log("Main.onUnload()");
	if (keyDownEventListener != null) {
		document.removeEventListener('keydown', keyDownEventListener);
		keyDownEventListener = null;
	}
}

// enabling media keys
Main.enableMediaKeys = function () {
	console.log("Main.enableMediaKeys()");

	tizen.tvinputdevice.registerKey("MediaPlayPause");
	tizen.tvinputdevice.registerKey("MediaPlay");
	tizen.tvinputdevice.registerKey("MediaStop");
	tizen.tvinputdevice.registerKey("MediaPause");
	tizen.tvinputdevice.registerKey("MediaRewind");
	tizen.tvinputdevice.registerKey("MediaFastForward");
}

function keyDownActions(e) {
	switch (e.keyCode) {
		case tvKey.LEFT: // LEFT arrow
			console.log("LEFT");
			Player.currentTime(Player.currentTime() - 10);
			break;
		case tvKey.UP: // UP arrow
			console.log("UP");
			break;
		case tvKey.RIGHT: // RIGHT arrow
			Player.currentTime(Player.currentTime() + 10)
			break;
		case tvKey.DOWN: // DOWN arrow
			console.log("DOWN");
			break;
		case tvKey.ENTER: // OK button
			if (Player.paused()) {
				Player.play();
			} else {
				Player.pause();
			}
			break;
		case tvKey.RETURN: // RETURN button
			console.log("RETURN");
			window.history.back();
			break;
		case tvKey.PLAYPAUSE: // PLAYPAUSE button
			console.log("PLAYPAUSE");
			if (Player.paused()) {
				Player.play();
			} else {
				Player.pause();
			}
			break;
		default:
			console.log("Key code : " + e.keyCode);
			break;
	}
}

// binding some events
window.onload = Main.onLoad;
window.onunload = Main.onUnload;
