const URL = "https://teachablemachine.withgoogle.com/models/[...]"; // <-- paste your model URL here!

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas); // ✅ Notice this container
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  prediction.sort((a, b) => b.probability - a.probability);

  const focusStatus = prediction[0].className;

  document.getElementById("status").innerText = `Status: ${focusStatus}`;

  if (focusStatus === "Focused") {
    document.body.style.backgroundColor = "#d4edda"; // light green
  } else {
    document.body.style.backgroundColor = "#f8d7da"; // light red
  }
}

init();
