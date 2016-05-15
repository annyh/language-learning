/**
 * Uses SpeechSynthesisUtterance to pronounce selected text.
 */

var textarea = document.getElementById('pronounce_txt');
// get textarea to auto-fit text
textarea.style.height = textarea.scrollHeight;

if (window.SpeechSynthesisUtterance === undefined) {
    alert('no speaking due to undefined window.SpeechSynthesisUtterance');

    document.getElementById('speaker-button').setAttribute('disabled', 'disabled');
} else {
    var voices = document.getElementById('voice');
    var rate = document.getElementById('rate');
    var pitch = document.getElementById('pitch');

    // Workaround for a Chrome issue (#340160 - https://code.google.com/p/chromium/issues/detail?id=340160)
    var watch = setInterval(function() {
        // Load all voices available
        var voicesAvailable = speechSynthesis.getVoices();
        if (voicesAvailable.length !== 0) {
            for (var i = 0; i < voicesAvailable.length; i++) {
                voices.innerHTML += '<option value="' + voicesAvailable[i].lang + '"' +
                    'data-voice-uri="' + voicesAvailable[i].voiceURI + '">' +
                    voicesAvailable[i].name +
                    (voicesAvailable[i].default ? ' (default)' : '') + '</option>';
            }
            clearInterval(watch);
        }
    }, 1);
}
var speaker_button = document.getElementById('speaker-button');

preventDeselectizeText(speaker_button);

function preventDeselectizeText(elem) {
    elem.onmousedown = function(e) {
        e = e || window.event;
        e.preventDefault();
    };
}

function turnSpeakerImageOff(elem) {
    // replace on with off
    elem.classList.toggle('fa-volume-up');
    elem.classList.toggle('fa-volume-off');
}

function turnSpeakerImageOn(elem) {
    // replace off with on
    elem.classList.toggle('fa-volume-off');
    elem.classList.toggle('fa-volume-up');
}

speaker_button.onclick = function() {
    // if volume off, log selected text
    var icon = document.getElementById('speaker-icon');
    // not speaking. Start speaking
    if (icon.classList.contains('fa-volume-off')) {
        var text = window.getSelection().toString();
        console.log(text);
        var selectedVoice = voices.options[voices.selectedIndex];
        // Create the utterance object setting the chosen parameters
        var utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        utterance.voice = selectedVoice.getAttribute('data-voice-uri');
        utterance.lang = selectedVoice.value;
        utterance.rate = rate.value;
        utterance.pitch = pitch.value;

        utterance.onstart = function() {
            turnSpeakerImageOn(icon);
            console.log('Speaker started');
        };
        utterance.onend = function() {
            turnSpeakerImageOff(icon);
            console.log('Speaker finished');
        };

        window.speechSynthesis.speak(utterance);
    } else { //speaking
        turnSpeakerImageOff(icon);
        window.speechSynthesis.cancel();
        console.log('Speaker stopped');
    }
};
