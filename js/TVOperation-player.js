
var Main = {};
var Player;
	
// called when application was loaded
Main.onLoad = function () {
	console.log("Main.onLoad()");
	
	// enabling media keys
	setTimeout(function (e) {
		Main.enableMediaKeys();
	}, 100);
	//
	
	// setup handler to key events
	Main.handleKeyDownEvents();
	
	// setup video player
	//Player.init("player");
}

// called when application has closed
Main.onUnload = function () {
	console.log("Main.onUnload()");
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

// handle all keydown events triggered through remote control.
Main.handleKeyDownEvents = function () {

	// add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	    	
    	switch(e.keyCode){
    	case tvKey.LEFT: // LEFT arrow
        	console.log("LEFT");
    		break;
    	case tvKey.UP: // UP arrow
    		console.log("UP");
    		break;
    	case tvKey.RIGHT: // RIGHT arrow
    		console.log("RIGHT");
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
    		break;
    	default:
    		console.log("Key code : " + e.keyCode);
    		break;
    	}
    });
}

// binding some events
window.onload = Main.onLoad;
window.onunload = Main.onUnload;


