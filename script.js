// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById("user-image");
const ctx = canvas.getContext("2d");
const clr = document.querySelector("button[type=reset]");
const readtxt = document.querySelector("button[type=button]");
const textT = document.getElementById("text-top");
const textB = document.getElementById("text-bottom");
const sub = document.querySelector("button[type=submit]");
let file;

const speech = window.speechSynthesis;
const volume = document.querySelector("input[type=range]");
const voice = document.getElementById("voice-selection");
var selectedVoice; 
var voices = [];

// load image into img object
const input = document.getElementById("image-input");


function populateList() {

  voices = speech.getVoices();
  voice.remove(voice.getElementsByTagName('option')[0]);
  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
      option.selected = true;
      selectedVoice = voices[i];
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voice.appendChild(option);
  }
}

populateList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateList;
}

input.addEventListener("change", function() {
  file = this.files[0];
  const url = URL.createObjectURL(file);
  img.src = url;
  img.alt = file.name;

});

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener("load", function() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  var obj = getDimmensions(400, 400, img.width, img.height);
  ctx.drawImage(img, obj.startX, obj.startY, obj.width, obj.height);

  clr.disabled = false;
  readtxt.disabled = false;
  voice.disabled = false;
});

clr.addEventListener('click', function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clr.disabled = true;
  readtxt.disabled = true;
  sub.disabled = false;

  textT.value = "";
  textB.value = "";

  input.value = '';

});

const form = document.getElementById("generate-meme");
form.addEventListener("submit", function() {
  event.preventDefault();
  ctx.font = "40px Impact";
  ctx.textAlign = "center";

  sub.disabled = true;
  clr.disabled = false;
  readtxt.disabled = false;

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeText(textT.value, canvas.width/2 , 50);
  ctx.strokeText(textB.value, canvas.width/2 , canvas.height-20);
  ctx.fillStyle = 'white';
  ctx.fillText(textT.value, canvas.width/2 , 50);
  ctx.fillText(textB.value, canvas.width/2 , canvas.height-20);
});

readtxt.addEventListener("click", function() {
  let utt1 = new SpeechSynthesisUtterance(textT.value);
  let utt2 = new SpeechSynthesisUtterance(textB.value);
  utt1.volume = volume.value/100;
  utt2.volume = volume.value/100;
  utt1.voice = selectedVoice;
  utt2.voice = selectedVoice;
  speech.speak(utt1);
  speech.speak(utt2);
});

voice.addEventListener('change', function() {
  selectedVoice = voice.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedVoice) {
      selectedVoice = voices[i];
      break;
    }
  }
  const test = 0;
});

volume.addEventListener("input", function() {
  const vol = document.getElementById("volume-group").getElementsByTagName('img')[0];
  if (volume.value >= 67 && volume.value <= 100) {
    vol.src = "volume-level-3.svg";
    vol.alt = "Volume Level 3";
  }
  else if (volume.value >= 34 && volume.value <= 66) {
    vol.src = "volume-level-2.svg";
    vol.alt = "Volume Level 2";
  }
  else if (volume.value >= 1 && volume.value <= 33) {
    vol.src = "volume-level-1.svg";
    vol.alt = "Volume Level 1";
  }
  else {
    vol.src = "volume-level-0.svg";
    vol.alt = "Volume Level 0";
  }
  

});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
