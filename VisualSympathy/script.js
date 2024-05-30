// the below note ranges define a certain frequency range for a given note.
// Once than note is identified to be in the sound it also displays a certain colour. This will work with some other elements down the line

const noteRanges = [
  { note: "C", min: 16.35, max: 32.7, color: "#ff0000" },
  { note: "C#", min: 17.32, max: 34.65, color: "#ff4000" },
  { note: "D", min: 18.35, max: 36.71, color: "#ff8000" },
  { note: "D#", min: 19.45, max: 38.89, color: "#ffbf00" },
  { note: "E", min: 20.6, max: 41.2, color: "#ffff00" },
  { note: "F", min: 21.83, max: 43.65, color: "#bfff00" },
  { note: "F#", min: 23.12, max: 46.25, color: "#80ff00" },
  { note: "G", min: 24.5, max: 49.0, color: "#40ff00" },
  { note: "G#", min: 25.96, max: 51.91, color: "#00ff00" },
  { note: "A", min: 27.5, max: 55.0, color: "#00ff80" },
  { note: "A#", min: 29.14, max: 58.27, color: "#00ffbf" },
  { note: "B", min: 30.87, max: 61.74, color: "#00ffff" },
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

// the below function 'drawWaveform'

function drawWaveform(canvas, analyser) {
  const canvasCtx = canvas.getContext("2d");
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const minFrequency = 20; // Set a minimum frequency for display. I have chosen this as the minimum because is is suposedly the lowest frequescy a human ear can hear
    const maxFrequency = analyser.context.sampleRate / 2; // Maximum frequency is half the sample rate
    const logMinFrequency = Math.log2(minFrequency);
    const logMaxFrequency = Math.log2(maxFrequency);

    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255.0;
      const y = v * canvas.height;

      const frequency = (i * maxFrequency) / bufferLength;
      const logFrequency = Math.log2(frequency);
      const normalizedLogFrequency =
        (logFrequency - logMinFrequency) / (logMaxFrequency - logMinFrequency);
      const x = normalizedLogFrequency * canvas.width;

      const color = getNoteColor(frequency);

      // Apply a uniform color intensity by setting the alpha to 1
      const colorWithUniformIntensity = color + "FF"; // Add full opacity

      canvasCtx.fillStyle = colorWithUniformIntensity;
      canvasCtx.fillRect(x, canvas.height - y, 1, y);
    }
  }

  draw();
}

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
    const reader = new FileReader();
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

      drawWaveform(canvas, analyser);
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

document.getElementById("fullscreenButton").addEventListener("click", () => {
  const canvas = document.getElementById("audioCanvas");
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.webkitRequestFullscreen) {
    /* Safari */
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    /* IE11 */
    canvas.msRequestFullscreen();
  }
});
