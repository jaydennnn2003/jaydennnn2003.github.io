// the below note ranges define a certain frequency range for a given note.
// Once than note is identified to be in the sound it also displays a certain colour. This will work with some other elements down the line

const noteRanges = [
  { note: "C", min: 16.35, max: 32.7, color: "#C2EDF2" },
  { note: "C#", min: 17.32, max: 34.65, color: "#B4E4F0" },
  { note: "D", min: 18.35, max: 36.71, color: "#A7DAEE" },
  { note: "D#", min: 19.45, max: 38.89, color: "#9ACFEA" },
  { note: "E", min: 20.6, max: 41.2, color: "#8DC3E7" },
  { note: "F", min: 21.83, max: 43.65, color: "#80B7E4" },
  { note: "F#", min: 23.12, max: 46.25, color: "#73ABE1" },
  { note: "G", min: 24.5, max: 49.0, color: "#8A92DD" },
  { note: "G#", min: 25.96, max: 51.91, color: "#A17AD9" },
  { note: "A", min: 27.5, max: 55.0, color: "#B861D5" },
  { note: "A#", min: 29.14, max: 58.27, color: "#CF48D1" },
  { note: "B", min: 30.87, max: 61.74, color: "#FA64F7" },
];

// the below javascript allows a note to be identified throughout many octaves.
// This is done by multiplying the min and max both by the power of 2 scaling the whole length of a piano essentially.

for (let i = 1; i <= 7; i++) {
  noteRanges.push(
    ...noteRanges.map((range) => ({
      note: range.note,
      min: range.min * Math.pow(2, i),
      max: range.max * Math.pow(2, i),
      color: range.color,
    }))
  );
}

// The below function scans the frequency and places a note in its category based on the frequency being outputed. If there is no note detected the colour will return.

function getNoteColor(frequency) {
  for (let range of noteRanges) {
    if (frequency >= range.min && frequency <= range.max) {
      return range.color;
    }
  }
  return "#000000";
}

// the below function 'drawWaveform' canvas and analyser into context.
// This gets put into a 2d drawing context by the 'canvasCtx' the 'bufferLength' works with the 'dataArray' to
// get the length of the frequency data array and then create an array to put that data.

function drawWaveform(canvas, analyser) {
  const canvasCtx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // the draw function is used to creates an animation on the canvas. The canvas is contantly being filled with new data so in between each data set the the frame fills with white getting rid of the old one.

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const minFrequency = 20; // Set a minimum frequency for display. I have chosen this as the minimum because is is suposedly the lowest frequescy a human ear can hear
    const maxFrequency = analyser.context.sampleRate / 12; // Maximum frequency is 1/10 the sample rate for a better and more even visual spread
    const logMinFrequency = Math.log2(minFrequency); // calculates the min and max log of the of the frequencies.
    const logMaxFrequency = Math.log2(maxFrequency);

    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255.0; //makes the data range 0 to 1 to make it easier
      const y = v * canvas.height;

      const frequency = (i * maxFrequency) / bufferLength;
      const logFrequency = Math.log2(frequency);
      const normalizedLogFrequency =
        (logFrequency - logMinFrequency) / (logMaxFrequency - logMinFrequency);
      const x = normalizedLogFrequency * canvas.width;
      //calculating logs to spread the visulaisation based on the octaves rather than th frequencies
      const color = getNoteColor(frequency);

      // makes the colour stay uniform aand adds full opacity
      const colorWithUniformIntensity = color + "FF";

      canvasCtx.fillStyle = colorWithUniformIntensity;
      canvasCtx.fillRect(x, canvas.height - y, 1, y); // draws the vertical lines based on a section of frequency. this is given a width of 1px
    }
  }

  draw();
}
//the visualisation process retrieves elements from Id's and allows the screen to retrieve audio files and show file name with visualisation

async function startVisualization() {
  const audioElement = document.getElementById("audioPlayer");
  const canvas = document.getElementById("audioCanvas");
  const fileNameDisplay = document.getElementById("fileNameDisplay");

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "audio/*";
  fileInput.onchange = function (event) {
    const file = event.target.files[0];
    fileNameDisplay.textContent = `Playing: ${file.name}`;
    const reader = new FileReader(); // creating a reader to transfer the information
    reader.onload = function (e) {
      audioElement.src = e.target.result;
      audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;

      const source = audioCtx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      drawWaveform(canvas, analyser); //refers to above function
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

// requests full screen from different browsers

document.getElementById("fullscreenButton").addEventListener("click", () => {
  const canvas = document.getElementById("audioCanvas");
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    canvas.msRequestFullscreen();
  }
});
