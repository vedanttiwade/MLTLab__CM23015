let net;
const classifier = knnClassifier.create();
const webcamElement = document.getElementById('webcam');
const counts = [0, 0];

async function init() {
  console.log('Loading MobileNet...');
  // Load the model
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  webcamElement.srcObject = stream;

  // Start the prediction loop
  while (true) {
    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(webcamElement, 'conv_preds');
      // Get the most likely class and confidence from the classifier.
      const result = await classifier.predictClass(activation);

      const classes = ['Category A', 'Category B'];
      document.getElementById('prediction').innerText = `
        Prediction: ${classes[result.label]}\n
        Probability: ${Math.round(result.confidences[result.label] * 100)}%
      `;
    }
    await tf.nextFrame();
  }
}

async function addExample(classId) {
  // Capture an intermediate activation from MobileNet
  const activation = net.infer(webcamElement, 'conv_preds');

  // Pass the intermediate activation to the classifier.
  classifier.addExample(activation, classId);

  // Update UI counts
  counts[classId]++;
  document.getElementById(`count${classId}`).innerText = counts[classId];
}