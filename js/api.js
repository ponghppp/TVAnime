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
			var param = {
				id : id,
				name : animeName
			};
			var hrefParam = paramToHref(param);
			addToList(idx, 'series.html' + hrefParam, animeName + ' '
					+ animeEpisode);
			idx += 1;
		}
		item_count = maxIdx;
		showItem(0);
	});
}

function paramToHref(param) {
	var href = '?';
	for (var i = 0; i < Object.keys(param).length; i++) {
		var key = Object.keys(param)[i];
		var value = Object.values(param)[i];
		href += (key + '=' + value);
		if (i < Object.keys(param).length - 1) {
			href += '&';
		}
	}
	return href;
}

function addToList(idx, href, text) {
	$('#list').append(
			'<li id="li' + idx + '"><a id="id' + idx + '" href="' + href
					+ '" style="box-shadow: 0 0;">' + text + '</a></li>')
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
	for (var i = 0; i < articleStart.length; i++) {
		var articleMap = {
			start : articleStart[i],
			end : articleEnd[i]
		};
		articleMaps.push(articleMap);
	}
	for (var i = 0; i < articleMaps.length; i++) {
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
	for (var i = 0; i < articleStart.length; i++) {
		var start = articleStart[i];
		var end = 0;
		for (var j = 0; j < articleEnd.length; j++) {
			var aEnd = articleEnd[j];
			if (aEnd < start) {
				continue;
			} else {
				end = aEnd;
				break;
			}
		}
		var articleMap = {
			start : start,
			end : end
		};
		articleMaps.push(articleMap);
	}
	for (var i = 0; i < articleMaps.length; i++) {
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
		var strBetweenFirstSpace = strBetweenFirstClose
				.substring(0, firstSpace);
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
	var attr = html.substring(attrIdx + 2 + attr.length,
			firstSpaceAfterAttr - 1);
	return attr;
}

function getSearchAnimeId(html, attr) {
	var href = getTagAttr(html, attr)
	var slash = href.lastIndexOf('/');
	var id = href.substring(slash + 1)
	return id;
}

function searchAnime(startPage, page, searchText) {
	var url = 'https://anime1.me/page/' + page + '?s=' + searchText;

	if (page == 1) {
		item_count = 0;
	}

	$
			.ajax({
				type : "GET",
				url : url,
				async : false,
				success : function(text) {
					var articles = getTagHtml(text, 'article');
					for (var i = 0; i < articles.length; i++) {
						var article = articles[i];
						var tagAs = getTagHtml(article, 'a');
						var animeName = getInnerHtml(tagAs[0]);
						var animeId = getSearchAnimeId(tagAs[0], 'href');
						var param = {
							id : animeId
						};
						var hrefParam = paramToHref(param);
						addToList(item_count + i, 'episode.html' + hrefParam,
								animeName);
					}
					item_count += articles.length;
					if (text.includes('nav-previous') && page <= 3) {
						searchAnime(startPage, page + 1, searchText);
					}
					showItem(0);
				}
			});
}

function animeSeriesOtherPage(url) {
	$
			.ajax({
				type : "GET",
				url : url,
				async : false,
				success : function(text) {
					var animeNames = [];
					var h2s = getTagHtml(text, 'h2');
					for (var i = 0; i < h2s.length; i++) {
						var tagAs = getTagHtml(h2s[i], 'a');
						if (tagAs.length == 0) {
							continue;
						}
						var animeName = getInnerHtml(tagAs[0]);
						animeNames.push(animeName);
					}
					var videos = getTagHtml(text, 'video');
					for (var i = 0; i < videos.length; i++) {
						var video = videos[i];
						var animeName = animeNames[i];
						var apireq = getTagAttr(video, 'data-apireq');
						var param = {
							apireq : apireq
						};
						var hrefParam = paramToHref(param);
						addToList(item_count + i, 'player.html' + hrefParam,
								animeName);
					}
					if (text.includes('nav-previous')) {
						var navDiv = getTagHtmlWithFirstAttr(text, 'div',
								'class="nav-previous"');
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

	$.ajax({
		type : "GET",
		url : url,
		async : false,
		success : function(text) {
			var animeNames = [];
			var h2s = getTagHtml(text, 'h2');
			for (var i = 0; i < h2s.length; i++) {
				var tagAs = getTagHtml(h2s[i], 'a');
				if (tagAs.length == 0) {
					continue;
				}
				var animeName = getInnerHtml(tagAs[0]);
				animeNames.push(animeName);
			}
			var videos = getTagHtml(text, 'video');
			for (var i = 0; i < videos.length; i++) {
				var video = videos[i];
				var animeName = animeNames[i];
				var apireq = getTagAttr(video, 'data-apireq');
				var param = {
					apireq : apireq
				};
				var hrefParam = paramToHref(param);
				addToList(i, 'player.html' + hrefParam, animeName);
			}
			item_count += videos.length;
			if (text.includes('nav-previous')) {
				var navDiv = getTagHtmlWithFirstAttr(text, 'div',
						'class="nav-previous"');
				var tagAs = getTagHtml(navDiv[0], 'a');
				var href = getTagAttr(tagAs[0], 'href');
				animeSeriesOtherPage(href);
			}
			showItem(0);
		}
	});
}

// function getAnimeUrl(apireq, callback) {
// var url = 'https://v.anime1.me/api';
// $.ajax({
// type : "POST",
// url : url,
// async : false,
// xhrFields : {
// withCredentials : !0
// },
// headers : {
// 'Content-Type' : 'application/x-www-form-urlencoded'
// },
// data : 'd=' + apireq,
// success : function(json, textStatus, request) {
// //var animeUrl = 'https:' + json.s[0].src;
// var animeUrl = '//chima.v.anime1.me/1135/3b.mp4'
// console.log(url);
// console.log(request.getResponseHeader('Set-Cookie'));
// console.log(request.getAllResponseHeaders());
//			
// if (callback)
// callback(animeUrl);
// }
// })
// }
function getAnimeUrl(apireq, callback) {
	var url = 'http://192.168.50.115:10090/' + apireq;
	$.ajax({
		type : "GET",
		url : url,
		async : false,
		success : function(json) {
			console.log(json);
			var animeUrl = 'https:' + json.url;
			var cookie = json.cookie;
			if (callback)
				callback(animeUrl, cookie);
		}
	})
}

//function getAnime(url, cookie) {
//	var elem = document.getElementById("player");
//	var req = new XMLHttpRequest();
//	req.onload = function() {
//		var blob_uri = URL.createObjectURL(this.response);
//		elem.appendChild(document.createElement("source")).src = blob_uri;
//	};
//	req.responseType = "blob";
//	req.open('GET', url, true);
//	document.cookie = cookie;
//	// req.setRequestHeader('Cookie', cookie);
//	req.send(null);
//}
function getAnime(url, cookie) {
	$.ajax({
		url : url,
		cache : false,
		xhrFields : {
			responseType : 'blob'
		},
		headers: {'Cookie': cookie},
		success : function(data) {
			var elem = document.getElementById('player');
			var url = window.URL || window.webkitURL;
			var blob_uri = url.createObjectURL(data);
			elem.appendChild(document.createElement("source")).src = blob_uri;
		},
		error : function() {

		}
	});
}