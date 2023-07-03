import {
  ActionMenu,
  Interaction,
  Conditionals,
  ActiveTab,
  RecordingButton,
  Actions
} from "../components";
import { useMachine } from "@xstate/react";
import { AppStateMachine } from "../AppState/state.js";
import { useRef, useEffect, memo, useState } from "react";
import messageTab from "../utils/messageTab";
import messageBackground from "../utils/messageBackground";
import "../styles/workflow.css";


// ::::: UNCOMMENT THIS COMPONENT WHEN PORTING TO TAURI FRONTEND :::::
// import { invoke, window as TauriWindow } from "@tauri-apps/api";
// import ComposeLaunchButton from "../../components/ComposeLaunchButton";
// const RunButton = memo(({ disabled, dispatch, actions }) => {
//   function handleComposeLaunchError(e) {
//     console.error("invoke composeNew() COMMAND RESPONSE ERROR: ", e);
//   }
//   function handleComposeResponse(response) {
//     console.log(response);
//     dispatch({ type: "TAURI_WORKFLOW", Workflow: response });
//   }
// 
//   function handleRun(){
//     invoke("RunWorkflow", {
//       workflowValue: actions,
//       callerWindow: TauriWindow.getCurrent(),
//     })
//     .then((response) => {
//       console.log(response);
//     })
//     .catch((e) => {
//       console.log(e);
//     });
//   }
// 
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "10px",
//         padding: "10px",
//         width: "100%",
//       }}
//     >
//       <button
//         style={{
//           flex: "1",
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "center",
//           color: disabled ? "gray" : "white",
//           backgroundColor: disabled ? "#3e3e3e" : "#516644",
//           gap: "5px",
//         }}
//         onClick={handleRun}
//       >
//         <div>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             fill="currentColor"
//             class="bi bi-play"
//             viewBox="0 0 16 16"
//           >
//             <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
//           </svg>
//         </div>
//         <div style={{ fontWeight: "normal" }}>Run</div>
//       </button>
// 
//       <ComposeLaunchButton
//         launchUrl="https://google.com"
//         onComposeLaunchError={handleComposeLaunchError}
//         onComposeResponse={handleComposeResponse}
//       />
//     </div>
//   );
// });

const TabActions = ["SelectTab", "Navigate", "SelectTab", "CloseTab", "NewTab", "NewWindow", "SelectWindow", 'CloseWindow', "Back", "Forward"];

const Workflow = () => {
  const [current, send] = useMachine(AppStateMachine);
  const { flowActions, activeTab } = current.context;
  const actionListRef = useRef();

  useEffect(() => {
    localStorage.setItem("isComposeCompleted", "false");
    try {
      handleChromeRuntimeMessages();
      getRecordingStatus();
      getCurentActiveTab();
    } catch (err) {
      console.log("Warning: Not Runnning in Chrome Extension context");
      console.warn(err);
    }
  }, []);

  async function getRecordingStatus() {
    try {
      const response = await messageBackground({ message: "bg-recording-status" });
      if(response.recording){
        send({ type: response.recording ? "START_RECORD" : "STOP_RECORD" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleComposeFinish() {
    const composeData = localStorage.getItem("composeData");
    localStorage.setItem("isComposeCompleted", "true");

    if (composeData)
      await messageTab({
        message: "compose-completed",
        payload: JSON.parse(composeData),
      });
  }

  function handleChromeRuntimeMessages() {
    console.log("handleChromeRuntimeMessages called");

    chrome.runtime.onMessage.addListener(async function (request) {
      if (request.status === "new-recorded-action") {
        
        if(request.actionType === "Click"){
          send({
            type: "RECORDED_INTERACTION",
            actionType: request.actionType,
            payload: request.payload,
          });
        }

        else if(TabActions.includes(request.actionType)){
         send({
            type: "RECORDED_TAB_ACTION",
            actionType: request.actionType,
            payload: request.payload,
          }); 
        }  
      }

      // if (request.status === "current-recording-status") {
      //   send({ type: request.payload ? "START_RECORD" : "STOP_RECORD" });
      // }
    });
  }

  async function getCurentActiveTab() {
    async function asyncStorageGet(item) {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(item, (data) => {
          resolve(data[item]);
        });
      });
    }

    chrome.storage.onChanged.addListener((changes, _namespace) => {
      for (let [key, { _oldValue, newValue }] of Object.entries(changes)) {
        if (key === "lastActiveTabData") {
          send({ type: "UPDATE_ACTIVE_TAB", newTabInfo: newValue });
        }
      }
    });

    const lasActiveData = await asyncStorageGet("lastActiveTabData");
    if (lasActiveData)
      send({ type: "UPDATE_ACTIVE_TAB", newTabInfo: lasActiveData });
  }

  return (
    <div className="workflow-container flex-column align-center justify-content gap-1">
      <ActionMenu dispatch={send} listRef={actionListRef}/>
      {activeTab && <ActiveTab currentTab={activeTab} />}
      <RecordingButton currentTab={activeTab} state={current} dispatch={send} />

      {/* :::::::::::::: UNCOMMENT THE LINE BELOW WHEN PORTING TO TAURI FRONTEND :::::::::::::: */}
      {/* <RunButton disabled={flowActions.length === 0} dispatch={send} actions={flowActions}/> */}

      <div className="workflow-label">WORKFLOWS</div>
      <Actions actions={flowActions} dispatch={send} />
      <button
        style={{
          backgroundColor: "orange",
          color: "gray",
          padding: "10px",
          marginTop: "10px",
        }}
        onClick={handleComposeFinish}
      >
        Done
      </button>
    </div>
  );
};

export default Workflow;