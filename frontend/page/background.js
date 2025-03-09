chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const trackingUrls = [
      "youtube.com/watch",
      "google.com/search",
      "facebook.com",
      "twitter.com",
      "reddit.com",
      "instagram.com",
    ];

    if (trackingUrls.some((site) => tab.url.includes(site))) {
      console.log(`User visited: ${site}`);

      //   Add a fetch method to the database: fetch()
    }
  }
});
