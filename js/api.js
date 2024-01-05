function getAnimeList() {
	var url = 'https://d1zquzjgwo9yb.cloudfront.net/';
	
	$.get(url, function(data) {
		var maxIdx = 100;
		var idx = 0;
		for (var i = 0; i < data.length; i++) {
			if (idx == maxIdx) {
				break;
			}
			var anime = data[i];
			var id = anime[0];
			var animeName = anime[1];
			var animeEpisode = anime[2];
			if (animeName.includes('<a')) {
				continue;
			}
			idx += 1;
			$('#list').append('<li id="li' + idx + '"><a id="id' + idx + '" href="series.html?id=' + id + '" style="box-shadow: 0 0;">' + animeName + ' ' + animeEpisode + '</a></li>')
		}
		item_count = maxIdx;
		showItem(0);
	});
}

function getTagHtml(html, tag) {
	var articleStart = [];
	var articleEnd = [];
	var articles = [];
	var startRe = new RegExp('<' + tag + ' ', 'g');
	var endRe = new RegExp('<\/' + tag + '>', 'g');
	var guard = 100;
	while ((match = startRe.exec(html)) != null) {
	    articleStart.push(match.index);
	    if (guard-- < 0) {
	      console.error("Infinite loop detected")
	      break;
	    }
	}
	while ((match = endRe.exec(html)) != null) {
	    articleEnd.push(match.index + 3 + tag.length); // 3 = </>
	    if (guard-- < 0) {
	      console.error("Infinite loop detected")
	      break;
	    }
	}
	var articleMaps = [];
	for (var i = 0; i < articleStart.length ; i ++) {
	    var articleMap = { start: articleStart[i], end: articleEnd[i] };
	    articleMaps.push(articleMap);
	}
	for (var i = 0; i < articleMaps.length ; i ++) {
	    var articleMap = articleMaps[i];
	    var article = html.substring(articleMap.start, articleMap.end);
	    articles.push(article);
	}
	return articles;
}

function getTagHtmlWithFirstAttr(html, tag, firstAttr) {
	var articleStart = [];
	var articleEnd = [];
	var articles = [];
	var startRe = new RegExp('<' + tag + ' ' + firstAttr, 'g');
	var endRe = new RegExp('<\/' + tag + '>', 'g');
	var guard = 100;
	while ((match = startRe.exec(html)) != null) {
	    articleStart.push(match.index);
	    if (guard-- < 0) {
	      console.error("Infinite loop detected")
	      break;
	    }
	}
	while ((match = endRe.exec(html)) != null) {
	    articleEnd.push(match.index + 3 + tag.length); // 3 = </>
	    if (guard-- < 0) {
	      console.error("Infinite loop detected")
	      break;
	    }
	}
	var articleMaps = [];
	for (var i = 0; i < articleStart.length ; i ++) {
		var start = articleStart[i];
		var end = 0;
		for (var j = 0; j < articleEnd.length ; j ++) {
			var aEnd = articleEnd[j];
			if (aEnd < start) {
				continue;
			} else {
				end = aEnd;
				break;
			}
		}
	    var articleMap = { start: start, end: end };
	    articleMaps.push(articleMap);
	}
	for (var i = 0; i < articleMaps.length ; i ++) {
	    var articleMap = articleMaps[i];
	    var article = html.substring(articleMap.start, articleMap.end);
	    articles.push(article);
	}
	return articles;
}

function getInnerHtml(html) {
	var fisrtClose = html.indexOf('>'); 
	var strBetweenFirstClose = html.substring(0, fisrtClose);
	var tag = '';
	if (strBetweenFirstClose.includes(' ')) {
		var firstSpace = strBetweenFirstClose.indexOf(' ');
		var strBetweenFirstSpace = strBetweenFirstClose.substring(0, firstSpace);
		tag = strBetweenFirstSpace.replace('<', '');
	} else {
		tag = strBetweenFirstClose.replace('<', '');
	}
	var firstTagClose = html.indexOf('</' + tag + '>');
	var strBetweenTagClose = html.substring(fisrtClose + 1, firstTagClose);	
	return strBetweenTagClose;
}

function getTagAttr(html, attr) {
	var attrIdx = html.indexOf(attr); 
	var firstSpaceAfterAttr = html.indexOf(' ', attrIdx);
	if (firstSpaceAfterAttr == -1) {
		firstSpaceAfterAttr = html.length - 1;
	}
	var attr = html.substring(attrIdx + 2 + attr.length, firstSpaceAfterAttr - 1);
	return attr;
}

function getSearchAnimeId(html, attr) {
	var href = getTagAttr(html, attr)
	var slash = href.lastIndexOf('/');
	var id = href.substring(slash + 1)
	return id;
}

function searchAnime(searchText) {
	var url = 'https://anime1.me?s=' + searchText;
		
	$.ajax({ type: "GET",   
        url: url,   
        async: false,
        success : function(text)
        {
        	var articles = getTagHtml(text, 'article');
        	for (var i = 0; i < articles.length ; i ++) {
        	    var article = articles[i];
        	    var tagAs = getTagHtml(article, 'a');
        	    var animeName = getInnerHtml(tagAs[0]);
        	    var animeId = getSearchAnimeId(tagAs[0], 'href');
        	    $('#list').append('<li id="li' + i + '"><a id="id' + i + '" href="episode.html?id=' + animeId + '" style="box-shadow: 0 0;">' + animeName + '</a></li>')
        	}
        	item_count = articles.length;
    		showItem(0);
        }
	});
}

function animeSeriesOtherPage(url) {	
	$.ajax({ type: "GET",   
        url: url,   
        async: false,
        success : function(text)
        {
        	var animeNames = [];
        	var h2s = getTagHtml(text, 'h2');
        	for (var i = 0; i < h2s.length ; i ++) {
        	    var tagAs = getTagHtml(h2s[i], 'a');
        	    if (tagAs.length == 0) {
        	    	continue;
        	    }
        	    var animeName = getInnerHtml(tagAs[0]);
        	    animeNames.push(animeName);
        	}
        	var videos = getTagHtml(text, 'video');
        	for (var i = 0; i < videos.length ; i ++) {
        	    var video = videos[i];
        	    var animeName = animeNames[i];
        	    var apireq = getTagAttr(video, 'data-apireq');
        	    $('#list').append('<li id="li' + (item_count + i) + '"><a id="id' + (item_count + i) + '" href="episode.html?apireq=' + apireq + '" style="box-shadow: 0 0;">' + animeName + '</a></li>')
        	}
        	if (text.includes('nav-previous')) {
        		var navDiv = getTagHtmlWithFirstAttr(text, 'div', 'class="nav-previous"');
        		var tagAs = getTagHtml(navDiv[0], 'a');
        		var href = getTagAttr(tagAs[0], 'href');
        	}
        	item_count += videos.length;
        }
	});
}

function animeSeries(seriesId) {
	var url = 'https://anime1.me/?cat=' + seriesId;
	item_count = 0;
	
	$.ajax({ type: "GET",   
        url: url,   
        async: false,
        success : function(text)
        {
        	var animeNames = [];
        	var h2s = getTagHtml(text, 'h2');
        	for (var i = 0; i < h2s.length ; i ++) {
        	    var tagAs = getTagHtml(h2s[i], 'a');
        	    if (tagAs.length == 0) {
        	    	continue;
        	    }
        	    var animeName = getInnerHtml(tagAs[0]);
        	    animeNames.push(animeName);
        	}
        	var videos = getTagHtml(text, 'video');
        	for (var i = 0; i < videos.length ; i ++) {
        	    var video = videos[i];
        	    var animeName = animeNames[i];
        	    var apireq = getTagAttr(video, 'data-apireq');
        	    $('#list').append('<li id="li' + i + '"><a id="id' + i + '" href="episode.html?apireq=' + apireq + '" style="box-shadow: 0 0;">' + animeName + '</a></li>')
        	}
        	item_count += videos.length;
        	if (text.includes('nav-previous')) {
        		var navDiv = getTagHtmlWithFirstAttr(text, 'div', 'class="nav-previous"');
        		var tagAs = getTagHtml(navDiv[0], 'a');
        		var href = getTagAttr(tagAs[0], 'href');
        		animeSeriesOtherPage(href);
        	}
    		showItem(0);
        }
	});
}