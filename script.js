const URL = "./my_model/";
let model, webcam, labelContainer, maxPredictions;
let studySound;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the sound
    studySound = new Audio("study_sound.mp3"); // Replace with the path to your study sound file

    // load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup the webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    // Predict can take in an image, video, or canvas HTML element
    const prediction = await model.predict(webcam.canvas);
    if (prediction[0].className == "뜬눈" && prediction[0].probability.toFixed(2) == 1.00) {
        labelContainer.childNodes[0].innerHTML = "뜬눈";
    } else if (prediction[0].className == "감은눈" && prediction[1].probability.toFixed(2) == 1.00) {
        labelContainer.childNodes[1].innerHTML = "감은눈";
    }
}

function startProgram() {
    init();
    playSoundAndStart();
}

function playSoundAndStart() {
    studySound.play();

    setTimeout(() => {
        webcam.start();
        startStudy(); // Start your program logic here
    }, 500); // Adjust the delay (in milliseconds) if needed
}
