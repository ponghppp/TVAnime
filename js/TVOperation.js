var last_focus_index = 0;
var mainfocus = 0;
var item_count = 0;
var button_count = 3;

function setFocusElement(e) {
	console.log("setFocusElement : keyCode : " + e.keyCode);
	console.log("mainfocus = " + mainfocus);
	switch (e.keyCode) {
		case TvKeyCode.KEY_ENTER:
			if ($("#id" + mainfocus) != null) {				
				window.location.href = $("#id" + mainfocus).attr("href");
			} 
			break;
		case TvKeyCode.KEY_UP:
			if (mainfocus < item_count + 1 && mainfocus > 0) {
				mainfocus = mainfocus - 1;
				hideItem(last_focus_index);
				showItem(mainfocus);
				last_focus_index = mainfocus;
			}
			break;
		case TvKeyCode.KEY_DOWN:
			if (mainfocus < item_count - 1 && mainfocus > -1) {
				mainfocus = mainfocus + 1;
				hideItem(last_focus_index);
				showItem(mainfocus);
				last_focus_index = mainfocus;
			}
			break;
	}
}

function showItem(index) {
	$("#id" + index).addClass("ui-btn-active");
	$("#id" + index).addClass("ui-focus");
	$("#li" + index).addClass("ui-focus");
	if (document.getElementById("li" + index) != undefined) {
		document.getElementById("li" + index).scrollIntoView(false);
	}
}

function hideItem(index) {
	$("#id" + index).removeClass("ui-btn-active");
	$("#id" + index).removeClass("ui-focus");
	$("#li" + index).removeClass("ui-focus");
}

$(document).ready(function () {
	$(".ui-controlgroup-controls").attr("style", "width:50%");
});

