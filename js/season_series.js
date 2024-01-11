function season() {
	var query = decodeURIComponent(window.location.search);
	var urlParams = new URLSearchParams(query);
	var year = urlParams.get('year');
	var season = urlParams.get('season');
	$('#title').html(year + '年' + season + '季新番');
	getSeasonAnime(year, season);
}

window.onload = function () {
	$('#content').height(document.body.clientHeight * 0.75);
	season();
}