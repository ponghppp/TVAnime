function showLoading() {
    var loadingDiv = '<div id="loadingDiv" class="loading"><span class="loader"></span></div>';
    $('body').append(loadingDiv);
}

function hideLoading() {
    $('#loadingDiv').remove();
}

function serverDownloadAnime(id, apireq) {
    downloadAnime(id, apireq, function(path) {
        Player.src({
            'src': path,
            'type': 'video/mp4'
        });
        getLastPlayTime(id, function(e) {
            Player.currentTime(e);
            Player.play();
        })
    });
}

function playAnime(id, apireq) {
    getAnime(id, apireq, function(currentTime) {
        Player.src({
            'src': 'http://192.168.50.115:10090/anime.mp4',
            'type': 'video/mp4'
        });
        setTimeout(function(e) {
            Player.currentTime(currentTime);
            Player.play();
        }, 500);
    });
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
    });

    Player.on("canplay", function(r) {
        hideLoading();
    })

    Player.on("ready", function(r) {
        Player.enterFullWindow();
        Player.volume(1);
        if (tizen.filesystem.getDirName == null) {
            playAnime(id, apireq);
        } else {
            serverDownloadAnime(id, apireq);
        }
    })

    Player.on("pause", function(r) {
        if (Player.error() == null) {
            recordAnime(id, name, Player.currentTime());
        }
    })
}

setTimeout(function(e) {
    showLoading();
    play();
}, 100);