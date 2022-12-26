// client.js (continued)

// required dom elements
const buttonEl = document.getElementById('button');
const messageEl = document.getElementById('message');

// set initial state of application variables
messageEl.style.display = 'none';
let isRecording = false;
let recorder;

// runs real-time transcription and handles global variables
const run = async () => {
  if (isRecording) {
    if (recorder) {
      recorder.pauseRecording();
      recorder = null;
    }
  } else {
    // once socket is open, begin recording
    messageEl.style.display = '';
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log("navigator.mediaDevices.getUserMedia ENTER");
        recorder = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
          recorderType: StereoAudioRecorder,
        //   timeSlice: 250, // set 250 ms intervals of data that sends to server
          timeSlice: 1000,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1, // real-time requires only one channel
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
          ondataavailable: (blob) => {
            console.log("ondataavailable ENTER");
            const reader = new FileReader();
            reader.onload = () => {
              console.log("reader.onload ENTER");
              const base64data = reader.result;

              // send the audio data to the server as a base64 encoded string
              fetch('http://localhost:8000', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio_data: base64data.split('base64,')[1] })
              })
                .then(response => response.json())

                .then(data => {
                    if (data.text !== '') {
                      console.log(data.text);
                      messageEl.innerText += (' ' + data.text);
                    }
                })

                .catch(error => console.error(error));
            };
            reader.readAsDataURL(blob);
          },
        });

        recorder.startRecording();
      })
      .catch((err) => console.error(err));
  }

  isRecording = !isRecording;
  buttonEl.innerText = isRecording ? 'Stop' : 'Start';
};

buttonEl.addEventListener('click', () => run());
