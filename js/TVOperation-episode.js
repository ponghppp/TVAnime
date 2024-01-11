function setFocusElement(e) {
	switch (e.keyCode) {
		case TvKeyCode.KEY_ENTER:
			var query = decodeURIComponent(window.location.search);
			var urlParams = new URLSearchParams(query);
			var id = urlParams.get('id');
			if (document.activeElement.id == 'seriesBtn') {
				animeSeriesFromEpisode(id);
			} else if (document.activeElement.id == 'episodeBtn') {
				animeEpisode(id);
			}
			break;
		case TvKeyCode.KEY_UP:
			$('#seriesBtn').focus();
			break;
		case TvKeyCode.KEY_DOWN:
			$('#episodeBtn').focus();
			break;
	}
}