const axios = require('axios');
const fs = require('fs');
const nodeWebcam = require('node-webcam');

// Configure webcam
const webcam = nodeWebcam.create({
    width: 640,
    height: 480,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: 'jpeg',
    device: false,
    callbackReturn: 'location',
    verbose: false,
});

// Function to capture an image and send it to the API
async function captureAndDetectEmotion() {
    // Capture an image from the webcam
    const imagePath = './capture.jpg';
    webcam.capture(imagePath, async (err) => {
        if (err) {
            console.error('Error capturing image:', err);
            return;
        }

        // Read the captured image file
        const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });

        // Send the image data to the Flask API
        try {
            const response = await axios.post('http://localhost:5000/detect_emotion', {
                image: imageData,
            });
            console.log('Detected Emotion:', response.data.emotion);
        } catch (error) {
            console.error('Error sending request:', error.message);
        }
    });
}

// Capture and detect emotion every 1 second
setInterval(captureAndDetectEmotion, 1000);