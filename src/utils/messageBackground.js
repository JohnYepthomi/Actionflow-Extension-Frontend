export default function messageBackground(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        // Handle any error that occurred during message sending
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}


// export default async function messageBackground(message){
//   return await new Promise(async (res) => {
//     await chrome.runtime.sendMessage(message, (response) => {
//       if(response)
//         res(response);
//       else res("no-response");
//     });
//   });
// }