let negativeEmotionDetected = false; // Boolean to track negative emotions
let waitingForUser = false; // Prevents further changes until "OK" is clicked

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'changeBackground') {
        const emotion = message.emotion;

        // If waiting for user confirmation, do not proceed
        if (waitingForUser) {
            return;
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
                tintColor = 'rgba(0, 0, 139, 0.3)'; // Dark Blue Tint
                negativeEmotionDetected = true;
                break;
            case 'happy':
                tintColor = 'rgba(255, 255, 0, 0.3)'; // Yellow Tint
                break;
            case 'sad':
                tintColor = 'rgba(169, 169, 169, 0.3)'; // Gray Tint
                negativeEmotionDetected = true;
                break;
            case 'angry':
                tintColor = 'rgba(255, 0, 0, 0.3)'; // Red Tint
                negativeEmotionDetected = true;
                break;
            case 'surprised':
                tintColor = 'rgba(128, 0, 128, 0.3)'; // Purple Tint
                break;
            case 'disgust':
                tintColor = 'rgba(0, 128, 0, 0.3)'; // Green Tint
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
        overlay.style.zIndex = '9999';
        overlay.style.pointerEvents = 'none';
        overlay.style.transition = 'background-color 1s ease-in-out, opacity 1s ease-in-out';
        overlay.style.opacity = '1';

        // Show the help message if a negative emotion is detected
        if (negativeEmotionDetected) {
            waitingForUser = true; // Prevent further background updates

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
            helpMessage.style.zIndex = '10000';
            helpMessage.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.3)';
            helpMessage.style.fontSize = '18px';
            helpMessage.style.textAlign = 'center';

            let messageText = '';
            if (emotion === 'angry') {
                messageText = 'It seems like you are angry. Take a deep breath and relax.';
            } else if (emotion === 'fear') {
                messageText = 'You might be feeling scared. Try to calm down and feel safe.';
            } else if (emotion === 'sad') {
                messageText = 'You might be feeling sad. Take a deep breath and relax.';
            }
            helpMessage.textContent = messageText;

            // Remove existing button before adding a new one to prevent duplicates
            let existingButton = document.getElementById('help-ok-button');
            if (existingButton) {
                existingButton.remove();
            }

            const button = document.createElement('button');
            button.id = 'help-ok-button';
            button.textContent = 'OK';
            button.style.marginTop = '10px';
            button.style.padding = '10px';
            button.style.fontSize = '16px';

            button.onclick = function () {
                // Reset the negative emotion tracking
                negativeEmotionDetected = false;
                waitingForUser = false; // Allow new emotions to be detected

                // Remove the help message
                helpMessage.remove();

                // Fade the overlay back to neutral but keep it active
                overlay.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Reset overlay to transparent
            };

            helpMessage.appendChild(button);
        }
    }
});
