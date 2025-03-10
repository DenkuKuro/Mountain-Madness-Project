document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const emotionDisplay = document.getElementById('emotion');
    const toggleInput = document.getElementById('toggle');
    const checkboxInput = document.getElementById('checkboxInput');
    let mute = false;

    // Add an event listener for the 'change' event
    checkboxInput.addEventListener('change', (event) => {
        // Log the state of the mute button
        mute = event.target.checked;
        console.log('Mute state updated:', mute ? 'Muted' : 'Unmuted');
    });
    
    // Create and append the honeycomb div
    const graphContainer = document.querySelector(".graph");
    const honeycombDiv = document.createElement("div");
    honeycombDiv.classList.add("honeycomb");
    honeycombDiv.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    `;
    graphContainer.appendChild(honeycombDiv);
    
    // Initially hide honeycomb and emotion text
    honeycombDiv.style.display = "none";
    emotionDisplay.style.display = "block"; // Initially visible

    // Toggle between honeycomb and video + emotion text on switch click
    toggleInput.addEventListener('change', () => {
        if (toggleInput.checked) {
            video.style.display = "none";
            emotionDisplay.style.display = "none"; // Hide emotion text
            honeycombDiv.style.display = "flex";
        } else {
            honeycombDiv.style.display = "none";
            video.style.display = "block";
            emotionDisplay.style.display = "block"; // Show emotion text again
        }
    });

    // Check if elements exist
    if (!video || !canvas || !emotionDisplay) {
        console.error('Required elements not found!');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;

            // Set canvas size to match video
            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });
        })
        .catch((err) => {
            console.error('Error accessing webcam:', err);
            emotionDisplay.textContent = 'Webcam access denied or unavailable.';
        });

    // Function to capture a frame and send it to the API
    async function captureAndDetectEmotion() {
        // Draw the current video frame onto the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas image to a base64-encoded string
        const imageData = canvas.toDataURL('image/jpeg').split(',')[1];

        // Send the image data to the API
        try {
            const response = await fetch('http://127.0.0.1:5000/detect_emotion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageData }),
            });
            const result = await response.json();
            if (result && result.emotion) {
                emotionDisplay.textContent = `Detected Emotion: ${result.emotion}`;

                // Send the emotion data to content script
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'changeBackground',
                        emotion: result.emotion.toLowerCase(),
                        mute: mute
                    });
                });
            } else {
                console.error('Invalid API response:', result);
            }
        } catch (err) {
            console.error('Error sending request:', err);
        }
    }

    // Capture and detect emotion every 1 second
    setInterval(captureAndDetectEmotion, 1000);
});
