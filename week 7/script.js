const airportAudio = document.querySelector("#airport-audio");
console.log(airportAudio);

const playButton = document.querySelector("#play-button");
console.log(playButton);

playButton.addEventListener("click", playAirportAudio);

const pauseButton = document.querySelector("#pause-button");
console.log(pauseButton);

pauseButton.addEventListener("click", pauseAirportAudio);

function playAirportAudio() {
  console.log(airportAudio);
  airportAudio.play();
}

function pauseAirportAudio() {
  console.log(airportAudio);
  airportAudio.pause();
}

const popAudio = document.querySelector("#pop-audio");
console.log(popAudio);

const popButton = document.querySelector("#pop-button");
console.log(popButton);

popButton.addEventListener("click", popIt);

function popIt() {
  popAudio.play();
}
