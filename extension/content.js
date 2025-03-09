let negativeEmotionDetected = false; // Boolean to track negative emotions

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'changeBackground') {
        const emotion = message.emotion;

        // If a negative emotion is detected and the user has not clicked "OK", do nothing
        if (negativeEmotionDetected) {
            return; // Prevent further changes
        }

        // Create or find the overlay element
        let overlay = document.getElementById('emotion-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'emotion-overlay';
            document.body.appendChild(overlay);
        }

        // Set the tint color based on the detected emotion
        let tintColor = 'rgba(255, 255, 255, 0)'; // Default: Transparent

        switch (emotion) {
            case 'fear':
                tintColor = 'rgba(0, 0, 139, 0.5)'; // Dark Blue Tint
                negativeEmotionDetected = true; // Block further changes
                break;
            case 'happy':
                tintColor = 'rgba(255, 255, 0, 0.5)'; // Yellow Tint
                break;
            case 'sad':
                tintColor = 'rgba(169, 169, 169, 0.5)'; // Gray Tint
                negativeEmotionDetected = true; // Block further changes
                break;
            case 'angry':
                tintColor = 'rgba(255, 0, 0, 0.5)'; // Red Tint
                negativeEmotionDetected = true; // Block further changes
                break;
            case 'surprised':
                tintColor = 'rgba(128, 0, 128, 0.5)'; // Purple Tint
                break;
            case 'disgust':
                tintColor = 'rgba(0, 128, 0, 0.5)'; // Green Tint
                break;
            default:
                break;
        }

        // Apply styles to the overlay element
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = tintColor;
        overlay.style.zIndex = '9999'; // Ensure it appears above other elements
        overlay.style.pointerEvents = 'none'; // Allow interactions with elements below it

        // Apply the transition effect for fading
        overlay.style.transition = 'background-color 1s ease-in-out, opacity 1s ease-in-out';

        // Fade in the overlay
        overlay.style.opacity = '1'; // Make sure the overlay is visible

        // If the emotion is 'angry', 'fear', or 'sad', show the help message
        if (emotion === 'angry' || emotion === 'fear' || emotion === 'sad') {
            // Create or find the help message modal
            let helpMessage = document.getElementById('help-message');
            if (!helpMessage) {
                helpMessage = document.createElement('div');
                helpMessage.id = 'help-message';
                document.body.appendChild(helpMessage);
            }

            // Style the help message modal
            helpMessage.style.position = 'fixed';
            helpMessage.style.top = '50%';
            helpMessage.style.left = '50%';
            helpMessage.style.transform = 'translate(-50%, -50%)';
            helpMessage.style.backgroundColor = 'white';
            helpMessage.style.padding = '20px';
            helpMessage.style.border = '2px solid black';
            helpMessage.style.zIndex = '10000'; // Make sure it's above the overlay
            helpMessage.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.3)';
            helpMessage.style.fontSize = '18px';
            helpMessage.style.textAlign = 'center';

            // Set the message based on the emotion
            if (emotion === 'angry') {
                helpMessage.textContent = 'It seems like you are angry. Take a deep breath and relax.';
            } else if (emotion === 'fear') {
                helpMessage.textContent = 'You might be feeling scared. Try to calm down and feel safe.';
            } else if (emotion === 'sad') {
                helpMessage.textContent = 'You might be feeling sad. Take a deep breath and relax.';
            }

            // Create the "OK" button
            const button = document.createElement('button');
            button.textContent = 'OK';
            button.style.marginTop = '10px';
            button.style.padding = '10px';
            button.style.fontSize = '16px';
            button.onclick = function () {
                // Remove the help message and overlay when the user acknowledges
                helpMessage.style.display = 'none';
                overlay.style.opacity = '0'; // Fade the overlay out
                setTimeout(() => {
                    overlay.style.display = 'none'; // Hide the overlay after fading out
                }, 1000);
                
                // Reset the negative emotion tracking
                negativeEmotionDetected = false;
            };

            helpMessage.appendChild(button);
        }
    }
});
