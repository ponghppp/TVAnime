function season() {
	var query = decodeURIComponent(window.location.search);
	var urlParams = new URLSearchParams(query);
	var year = urlParams.get('year');
	var seasons = getSeasons().filter(s => s.year == year)[0].seasons;
	seasons = seasons.reverse();
	for (var i = 0; i < seasons.length; i++) {
		var season = seasons[i];
		var param = {
			year: year,
			season : season
		};
		var hrefParam = paramToHref(param);
		addToList(i, 'season_series.html' + hrefParam,  year + '年' + season + '季新番');
	}
	showItem(0);
	item_count = seasons.length;
}
window.onload = function () {
	$('#content').height(document.body.clientHeight * 0.75);
	season();
}