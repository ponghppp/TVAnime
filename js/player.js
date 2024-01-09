var animeId = 0;

function showLoading() {
	var loadingDiv = '<div id="loadingDiv" class="loading"><span class="loader"></span></div>';
	$('body').append(loadingDiv);
}

function hideLoading() {
	$('#loadingDiv').remove();
}

function play() {
	var query = decodeURIComponent(window.location.search);
	var urlParams = new URLSearchParams(query);
	var id = urlParams.get('id');
	var apireq = urlParams.get('apireq');

	animeId = id;
	
	Player = videojs('player', {
		sources : [ {
			src : getAnime(apireq),
			type: 'video/mp4'
		} ],
		width : document.body.clientWidth,
		height : document.body.clientHeight,
		controls : true
	});
	
	Player.on("ready", function(r) {
		hideLoading();
		Player.enterFullWindow();
		getLastPlayTime(id, function (currentTime) {
			Player.currentTime(currentTime);
		})		
	})

//	getAnimeUrl(id, apireq, function(url, currentTime) {
//		Player = videojs('player', {
//			sources : [ {
//				src : url
//			} ],
//			width : document.body.clientWidth,
//			height : document.body.clientHeight,
//			controls : true
//		});
//		Player.on("ready", function(r) {
//			hideLoading();
//			setTimeout(function(e) {
//				Player.currentTime(currentTime);
//			}, 100);
//			Player.enterFullWindow();
//		})
//	});
}

showLoading();

setTimeout(function(e) {
	play();
}, 100);