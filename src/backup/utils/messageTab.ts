import chromeStorageGet from "./chromeStorage";

export default async function messageTab(message: any) {
  const tabData = await chromeStorageGet("lastActiveTabData");
  console.log("in Frontend messageTab -> lastActiveTabData: ", tabData);
  await chrome.tabs.sendMessage(tabData.tabId, message);
}
