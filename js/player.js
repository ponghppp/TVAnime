var animeId = 0;
var currentTime = 0;

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
		width: document.body.clientWidth,
		height: document.body.clientHeight,
		controls: true,
		preload: "auto",
		autoplay: true,
	});
		
	Player.on("canplay", function(r) {
		hideLoading();
	})
	
	Player.on("ready", function(r) {
		Player.enterFullWindow();
		
		getAnime(id, apireq, function (cTime) {
			currentTime = cTime;
			Player.src({ 'src': 'http://192.168.50.115:10090/anime.mp4', 'type': 'video/mp4' });
			setTimeout(function(e) {
				Player.currentTime(currentTime);
			}, 500);
		});
	})
	
	Player.on("pause", function(r) {
		recordAnime(animeId, Player.currentTime())
	})
}

setTimeout(function(e) {
	showLoading();
	play();
}, 100);