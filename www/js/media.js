function playAudio(id) {
    try {
        window.system.setSystemVolume(1.0);
        var audioElement = document.getElementById(id);
        var url = audioElement.getAttribute('src');
        var my_media = new Media(url,
            // success callback
            function () {
                console.log("playAudio():Audio Success");
            },
            // error callback
            function (err) {
                console.log("playAudio():Audio Error: " + err);
            }
        );
        my_media.setVolume('1.0');
        // Play audio
        my_media.play();
    }
    catch (err) { }
}