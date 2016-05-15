/**
 * Uses webkitSpeechRecognition and user-provided text to evaluate the user's pronounciation.
 */

var info_start = 'Click on the microphone icon and begin speaking';
showInfo(info_start);

var final_transcript = '';
var recognizing = false;
var start_timestamp;
var start_button = document.getElementById('start_button');

if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        showInfo('Speak now.');
        turnMicrophoneOn(true);
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            turnMicrophoneOn(false);
            showInfo('No speech was detected. You may need to adjust your microphone settings');
        }
        if (event.error == 'audio-capture') {
            turnMicrophoneOn(false);
            showInfo('No microphone was found. Ensure that a microphone is installed and that  ' +
                'the microphone is configured correctly');
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('Permission to use microphone is blocked. To change, go to' +
                    ' chrome://settings/contentExceptions#media-stream');
            } else {
                showInfo('Permission to use microphone was denied.');
            }
        }
    };

    recognition.onend = function() {
        recognizing = false;
        turnMicrophoneOn(false);
        if (!final_transcript) {
            return;
        }
        var text = removePunctuation(window.getSelection().toString());
        doGrade(final_transcript, text);
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
    };
}

// removes punctuation from the provided string,
// including the leftover spaces
function removePunctuation(str) {
    var punctuationless = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    return punctuationless.replace(/\s{2,}/g, " ");
}

// if bool is true, turn microphone on
// else turn microphone off
function turnMicrophoneOn(bool) {
    document.getElementById('speaker_icon').className = bool ?
        'fa fa-microphone fa-5x' : 'fa fa-microphone-slash fa-5x';
}

// given a string, return it without leading/trailing whitespace
// turn to lowercase
function processStr(str) {
    if (typeof String.prototype.trim != 'function') { // detect native implementation
        String.prototype.trim = function() {
            return this.replace(/^\s+/, '').replace(/\s+$/, '');
        };
    }
    return str.trim().toLowerCase();
}

// given two strings, determine if they are the same
function doGrade(actual, expected) {
    if (processStr(actual) === processStr(expected)) {
        showMessage('SUCESS!', true);
    } else {
        showMessage('Not quite. Received ' + actual +
            '. Try reading the highlighted part again.', false);
    }
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('Web Speech API is not supported by this browser. Upgrade to chrome version 25 or higher');
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;

preventDeselectizeText(start_button);

function preventDeselectizeText(elem) {
    elem.onmousedown = function(e) {
        e = e || window.event;
        e.preventDefault();
    };
}
start_button.onclick = function() {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = document.getElementById('voice').options[0].value;
    recognition.start();
    showInfo('Click the Allow button above to enable your microphone.');
    start_timestamp = new Date(); // get timestamp
}

// use only for success/fail messages.
// show font-icon depending on bool: true for correct, false for incorrect
function showMessage(s, bool) {
    var info_bar = document.getElementById('info');
    var font_icon = document.createElement('i');
    var className = bool ?
        'fa fa-check-circle-o fa correct' :
        'fa fa-exclamation-circle fa incorrect';

    font_icon.setAttribute('class', className);
    font_icon.innerHTML = s;
    info_bar.innerHTML = '';
    info_bar.appendChild(font_icon);
}

function showInfo(s) {
    var info_bar = document.getElementById('info');
    info_bar.innerHTML = s;
}
