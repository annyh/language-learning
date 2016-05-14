if (window.SpeechSynthesisUtterance === undefined) {
  alert('no speaking due to undefined window.SpeechSynthesisUtterance');

  document.getElementById('speaker-button').setAttribute('disabled', 'disabled');
} else {
  var text = document.getElementById('pronounce_txt');
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
//clicking the 'test' element will not deselect text.
preventDeselectizeText($('.speaker-button')[0]);
preventDeselectizeText($('.microphone-button')[0]);

function preventDeselectizeText(elem) {
  elem.onmousedown = function(e) {
    e = e || window.event;
    e.preventDefault();
  };
}

// get textarea to auto-fit text
$("textarea").height($("textarea")[0].scrollHeight);

//TOGGLE FONT AWESOME ON CLICK
$('.speaker-button').click(function() {
  // if volume off, log selected text
  var icon = $(this).find('i');
  // not speaking. Start speaking
  if (icon.hasClass('fa-volume-off')) {
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
      console.log('Speaker started');
    };
    utterance.onend = function() {
      console.log('Speaker finished');
      icon.toggleClass('fa-volume-off fa-volume-up');
    };

    window.speechSynthesis.speak(utterance);
  } else { //speaking
    event.preventDefault();

    window.speechSynthesis.cancel();
    console.log('Speaker stopped');
  }
  icon.toggleClass('fa-volume-off fa-volume-up');
});

$('.microphone-button').click(function() {
  var icon = $(this).find('i');
  if (icon.hasClass('fa-microphone-slash')) {
    var text = window.getSelection().toString();
    var str = 'POSTing ' + text + ' and sound file to URL'
    console.log(str);
  }
  icon.toggleClass('fa-microphone fa-microphone-slash');
});