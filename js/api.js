function getAnimeList() {
	var url = 'https://d1zquzjgwo9yb.cloudfront.net/';
	
	$.get(url, function(data) {
		var top100 = data.slice(0, 100);
		for ( var i = 0; i < top100.length; i++) {
			var anime = top100[i];
			var id = anime[0];
			var animeName = anime[1];
			$('#list').append('<li id="li' + i + '"><a id="id' + i + '" href="javascript:void(0)" style="box-shadow: 0 0;">' + animeName + '</a></li>')
		}
		item_count = $("ul[data-role='listview']").find("a").length;
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
	    articleEnd.push(match.index + 3 + tag.length);
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

function getInnerHtmlOfTag(html, tag) {
	var regex = new RegExp('\\<' + tag + '\\>([\\s\\S]+?)\\<\\/' + tag+ '>', 'g');
	var result = [];
	var matches = [];
	while ((matches = regex.exec(html))) {
	  result.push(matches[1]);
	}
	console.log(result);
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
        	    var animeName = getInnerHtmlOfTag(tagAs[0], 'a');
        	    $('#list').append('<li id="li' + i + '"><a id="id' + i + '" href="javascript:void(0)" style="box-shadow: 0 0;">' + animeName + '</a></li>')
        	}
        	item_count = $("ul[data-role='listview']").find("a").length;
    		showItem(0);
        }
	});
}