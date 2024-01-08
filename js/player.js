function play() {
	var query = decodeURIComponent(window.location.search);
	var urlParams = new URLSearchParams(query);
	var apireq = urlParams.get('apireq');
	getAnimeUrl(apireq, function(url) {
		Player = videojs('player', {
			sources : [ {
				src : url
			} ],
			loop : true,
			muted : true,
			width : document.body.clientWidth,
			height : document.body.clientHeight,
			controls : true
		});
		Player.on("ready", function (r) {
			Player.enterFullWindow();
			$('#loading').addClass('finish-loading');
			$('#loading').removeClass('loading');
		})
	});
}

setTimeout(function(e) {
	play();
}, 100);