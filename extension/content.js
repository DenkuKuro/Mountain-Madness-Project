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
                tintColor = 'rgba(17, 212, 192, 0.15)'; // Dark Blue Tint
                negativeEmotionDetected = true;
                break;
            case 'happy':
                tintColor = 'rgba(232, 232, 80, 0.15)'; // Yellow Tint
                break;
            case 'sad':
                tintColor = 'rgba(47, 30, 233, 0.15)'; // Blue Tint
                negativeEmotionDetected = true;
                break;
            case 'angry':
                tintColor = 'rgba(255, 0, 0, 0.15)'; // Red Tint
                negativeEmotionDetected = true;
                break;
            case 'surprised':
                tintColor = 'rgba(183, 28, 183, 0.15)'; // Purple Tint
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
            helpMessage.style.borderRadius = '12px';
            helpMessage.style.border = 'none';
            helpMessage.style.zIndex = '10000';
            helpMessage.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.2)';
            helpMessage.style.fontSize = '18px';
            helpMessage.style.textAlign = 'center';
            helpMessage.style.maxWidth = '320px';
            helpMessage.style.color = '#333';
            helpMessage.style.fontFamily = '"Poppins", sans-serif';

            let messageText = document.createElement('p');
            messageText.style.marginBottom = '15px';
            messageText.style.fontWeight = '500';

            if (emotion === 'angry') {
                messageText.textContent = 'It seems like you are feeling angry. Take a deep breath and relax.';
            } else if (emotion === 'fear') {
                messageText.textContent = 'You might be feeling scared. Try to calm down and feel safe.';
            } else if (emotion === 'sad') {
                messageText.textContent = 'You might be feeling sad. Remember, it’s okay to feel this way. Breathe.';
            }

            helpMessage.appendChild(messageText);

            // Remove existing button before adding a new one to prevent duplicates
            let existingButton = document.getElementById('help-ok-button');
            if (existingButton) {
                existingButton.remove();
            }

            const button = document.createElement('button');
            button.id = 'help-ok-button';
            button.textContent = 'OK';
            button.style.marginTop = '10px';
            button.style.padding = '12px 20px';
            button.style.fontSize = '16px';
            button.style.fontWeight = '600';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '6px';
            button.style.cursor = 'pointer';
            button.style.transition = '0.3s ease-in-out';
            button.style.outline = 'none';
            button.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
            
            // Hover effect
            button.onmouseover = () => {
                button.style.backgroundColor = '#45A049';
            };

            button.onmouseout = () => {
                button.style.backgroundColor = '#4CAF50';
            };

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
