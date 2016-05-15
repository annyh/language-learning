#Language Learning App

Simple app for language-learners to practice pronounciation.

No backend code.
User data is not stored.
Use Chrome version 25 or above.

Contains the fundamentals of language learning:
- Machine reads user-provided content
- User gets near real-time feedback on his/her pronounciation

Uses the browser's [Web Speech API](http://caniuse.com/#search=speech), and [Speech Synthesis API](http://caniuse.com/#feat=speech-synthesis)

###How to use

0. Copy a piece of text (a few sentences) to practice. Choose the languge of the text in the ```Voice``` dropdown.
1. Put test to be read inside the text box.
2. Highlight the text to pronounce. See ```Limitations``` section below.
3. To hear the expected pronounciation of the highlighted text, click on the speaker button.
4. To check your pronounciation, Click the microphone button. Read the highlighted text. Then click on the microphone button again. You should get a pass/fail.
5. Repeat step 2 by highlighting aonther section of the text.

###Limitations
- Machine stops reading around 140 characters; if the highlighted text is longer than 140 characters, the part after the limit will not be read.
- Machine 'listens' for around 5 seconds. Hence the app is good for 'grading' short phrases, but not for long-text dictation.

###To run app locally:

1. clone app
2. start server with ```python -m SimpleHTTPServer```
3. access the app on ```http://localhost:8000/index.html```

###Inspired by
- [Google's Web Speech API demo](https://www.google.com/intl/en/chrome/demos/speech.html)