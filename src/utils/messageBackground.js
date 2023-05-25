// export default async function messageBackground(message){
//   await chrome.runtime.sendMessage(null, message);
// }

export default async function messageBackground(message){
  return await new Promise(async (res) => {
    await chrome.runtime.sendMessage(message, (response) => {
      if(response)
        res(response);
      else res("no-response");
    });
  });
}