import chromeStorageGet from "./chromeStorage";

export default async function injectScriptToActiveWindowTab() {
  const tabData = await chromeStorageGet("lastActiveTabData");

  await chrome.scripting.executeScript({
    target: { tabId: tabData.tabId },
    files: [
      "./contentscripts/BlogScraper.js",
    ],
  });
}
