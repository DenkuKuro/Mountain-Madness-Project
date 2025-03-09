let negativeEmotionDetected = false; // Boolean to track negative emotions
let waitingForUser = false; // Prevents further changes until message disappears
let cooldownActive = false; // Prevents popups for 3 seconds after closing
let currentAudio = null;

function playSound(emotion) {
    const soundMap = {
        "happy": chrome.runtime.getURL('sounds/happy.mp3'),
        "fear": chrome.runtime.getURL('sounds/fear.mp3'),
        "sad": chrome.runtime.getURL('sounds/sad.mp3'),
        "angry": chrome.runtime.getURL('sounds/angry.mp3'),
        "surprised": chrome.runtime.getURL('sounds/surprised.mp3'),
        "disgust": chrome.runtime.getURL('sounds/disgust.mp3'),
    };

    const soundFile = soundMap[emotion];
    if (soundFile) {
        const audio = new Audio(soundFile);
        audio.play().catch((error) => {
            console.error('Error playing sound:', error);
        });
        console.log("playing");
        // Stop the sound after 3 seconds
        setTimeout(() => {
            audio.pause(); // Pause the sound
            audio.currentTime = 0; // Reset the playback position (optional)
        }, 3000); // 3000 milliseconds = 3 seconds
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'changeBackground') {
        const emotion = message.emotion;

        // If cooldown is active, don't show another popup
        if (cooldownActive || waitingForUser) {
            return;
        }

        // Play the corresponding sound for the detected emotion
        playSound(emotion.toLowerCase());

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
                tintColor = 'rgba(47, 30, 233, 0.15)'; // Gray Tint
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
            helpMessage.style.borderRadius = '10px';
            helpMessage.style.zIndex = '10000';
            helpMessage.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
            helpMessage.style.fontSize = '18px';
            helpMessage.style.textAlign = 'center';
            helpMessage.style.opacity = '1';
            helpMessage.style.transition = 'opacity 0.5s ease-in-out';

            let messageText = '';
            if (emotion === 'angry') {
                messageText = 'It seems like you are angry. Take a deep breath and relax.';
            } else if (emotion === 'fear') {
                messageText = 'You might be feeling scared. Try to calm down and feel safe.';
            } else if (emotion === 'sad') {
                messageText = 'You might be feeling sad. Take a deep breath and relax.';
            }
            helpMessage.textContent = messageText;

            // Automatically remove the message after 3 seconds
            setTimeout(() => {
                helpMessage.style.opacity = '0'; // Fade out
                setTimeout(() => {
                    helpMessage.remove(); // Remove from DOM
                    negativeEmotionDetected = false;
                    waitingForUser = false; // Allow new emotions to be detected
                    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Reset overlay to transparent

                    // **Start Cooldown for 3 Seconds**
                    cooldownActive = true;
                    setTimeout(() => {
                        cooldownActive = false; // Allow new popups again
                    }, 3000);
                }, 500); // Wait for fade-out transition before removing
            }, 3000);
        }
    }
});
