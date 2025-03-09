// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'changeBackground') {
        const emotion = message.emotion;

      // Default background color
      let bgColor = 'white';

      // Change background color based on emotion
      switch (emotion) {
          case 'fear':
              bgColor = 'darkblue';
              break;
          case 'happy':
              bgColor = 'yellow';
              break;
          case 'sad':
              bgColor = 'gray';
              break;
          case 'angry':
              bgColor = 'red';
              break;
          case 'surprised':
              bgColor = 'purple';
              break;
          default:
              bgColor = 'white';
      }

      // Apply the background color to the webpage
      document.body.style.backgroundColor = bgColor;
  }
});
