function showLoading() {
    var loadingDiv = '<div id="loadingDiv" class="loading"><span class="loader"></span></div>';
    $('body').append(loadingDiv);
}

function hideLoading() {
    $('#loadingDiv').remove();
}

function serverDownloadAnime(id, apireq, callback) {
    downloadAnime(id, apireq, function(path) {
        Player.src({
            'src': path,
            'type': 'video/mp4'
        });
        callback();
    });
}

function playAnime(id, apireq, callback) {
	Player.src({
        'src': 'http://192.168.50.115:10090/api?id=' + id + '&apireq=' + apireq,
        'type': 'video/mp4'
    });
	callback();
}

function play() {
    var query = decodeURIComponent(window.location.search);
    var urlParams = new URLSearchParams(query);
    var id = urlParams.get('id');
    var name = urlParams.get('name');
    var apireq = urlParams.get('apireq');

    Player = videojs('player', {
        width: document.body.clientWidth,
        height: 1080,
        controls: true,
        preload: "auto",
        fluid: true
    });
    
    Player.on("canplay", function(r) {
        hideLoading();
    })

    Player.on("ready", function(r) {
        Player.enterFullWindow();
        Player.volume(1);
        Player.animeId = id;
        Player.animeName = name;
        getLastPlayTime(id, function(e) {
        	var callback = function () {
        		Player.currentTime(e);
                Player.play();
        	}
        	if (tizen.filesystem.getDirName == null) {
                playAnime(id, apireq, callback);
            } else {
                serverDownloadAnime(id, apireq, callback);
            }
        })
    })

    Player.on("pause", function(r) {
        if (Player.error() == null) {
            recordAnime(id, name, Player.currentTime(), Player.remainingTime());
        }
    })
}

setTimeout(function(e) {
    showLoading();
    play();
}, 100);