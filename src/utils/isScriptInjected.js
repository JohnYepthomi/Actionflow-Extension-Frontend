import chromeStorageGet from "./chromeStorage";

export default async function isScriptInjected() {
  const tabData = await chromeStorageGet("lastActiveTabData");

  let response = await chrome.scripting.executeScript({
    target: { tabId: tabData.tabId },
    func: () => (BLOG_SCRAPER_INJECTED ? true : false),
  });

  return response[0].result ? true : false;
}
