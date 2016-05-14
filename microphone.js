var langs =
[ ['Deutsch',         ['de-DE']],
 ['English',         ['en-AU', 'Australia'],
                     ['en-CA', 'Canada'],
                     ['en-IN', 'India'],
                     ['en-NZ', 'New Zealand'],
                     ['en-ZA', 'South Africa'],
                     ['en-GB', 'United Kingdom'],
                     ['en-US', 'United States']]
 ];

for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 0;


var info_start = 'Click on the microphone icon and begin speaking for as long as you like.';
showInfo(info_start);

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var start_button = document.getElementById("start_button");
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('Speak now.');
    // image to on
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      // image to off
      showInfo('No speech was detected. You may need to adjust your microphone settings');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      // image to off
      showInfo('No microphone was found. Ensure that a microphone is installed and that  ' +
        'the microphone is configured correctly');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('Permission to use microphone is blocked. To change, go to' +
        'chrome://settings/contentExceptions#media-stream');
      } else {
        showInfo('Permission to use microphone was denied.');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    // image to off
    if (!final_transcript) {
      return;
    }
    var text = window.getSelection().toString();
    console.log('final transcript is:', final_transcript, 'expected ',text);
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
    final_transcript = capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
  };
}

// given two strings, determine if they are the same
function doGrade(actual, expected) {
  if (typeof String.prototype.trim != 'function') { // detect native implementation
    String.prototype.trim = function () {
      return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
  }
  console.log('MATCH? ',  actual.trim() === expected.trim());

  var final_message = actual.trim() === expected.trim() ?
  'SUCESS!' : 'Not quite. Try speaking the highlighted part again.';
  // TODO: move this to where output won't be changed
  showInfo(final_message);
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
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

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
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  showInfo('Click the "Allow" button above to enable your microphone.');
  start_timestamp = new Date(); // get timestamp
}

function showInfo(s) {
  var info_bar = document.getElementById('info');
  info_bar.style.visibility = 'visible';
  info_bar.innerHTML = s;
  console.log('******************* showInfo RECEIVED ', s)
}