var backEventListener = null;
var keyDownEventListener = null;

var unregister = function () {
    if (backEventListener !== null) {
        document.removeEventListener('tizenhwkey', backEventListener);
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

function backEvent(e) {
    if (e.keyName == "back") {
        try {
            window.history.back();
        } catch (ex) {
            unregister();
        }
    }
}

//Initialize function
var init = function () {
    // register once
    if (backEventListener !== null) {
        return;
    }
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener('tizenhwkey', backEvent);
    backEventListener = backEvent;
    document.addEventListener('keydown', setFocusElement);
    keyDownEventListener = setFocusElement;
};

$(document).bind('pageinit', init);
$(document).unload(function () {
    if (backEventListener != null) {
        document.removeEventListener('tizenhwkey', backEventListener);
        backEventListener = null;
    }
    if (keyDownEventListener != null) {
        document.removeEventListener('keydown', keyDownEventListener);
        keyDownEventListener = null;
    }
});
