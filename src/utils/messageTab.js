import chromeStorageGet from "./chromeStorage";

export default async function messageTab(message) {
  const tabData = await chromeStorageGet("lastActiveTabData");
  console.log("FRONTEND lastActiveTab: ", tabData);
  await chrome.tabs.sendMessage(tabData.tabId, { message });
}
