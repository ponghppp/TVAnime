function year() {
	var seasons = getSeasons();
	for (var i = 0; i < seasons.length; i++) {
		var year = seasons[i].year;
		var param = {
			year : year
		};
		var hrefParam = paramToHref(param);
		addToList(i, 'season.html' + hrefParam, year);
	}
	showItem(0);
	item_count = seasons.length;
}
window.onload = function () {
	$('#content').height(document.body.clientHeight * 0.75);
	year();
}