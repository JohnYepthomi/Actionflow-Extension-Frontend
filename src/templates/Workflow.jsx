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

  function debounce(fn, ms) {
    let timer
    return _ => {
      clearTimeout(timer)
      timer = setTimeout(_ => {
        timer = null
        fn.apply(this, arguments)
      }, ms)
    };
  }

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
        status: "compose-completed",
        payload: JSON.parse(composeData),
      });
  }

  function handleChromeRuntimeMessages() {
    console.log("handleChromeRuntimeMessages called");

    chrome.runtime.onMessage.addListener(async function (request) {
      if (request.status === "new-recorded-action") {
        
        if(request.actionType === "Click"){
          send({
            type: "TAB_ACTIONS",
            actionType: request.actionType,
            payload: request.payload,
          });
        }

        else if(request.actionType === "SelectTab"){
         send({
            type: "TAB_ACTIONS",
            actionType: request.actionType,
            payload: request.payload,
          }); 
        }  

        else if(request.actionType === "Navigate"){
          send({
            type: "TAB_ACTIONS",
            actionType: request.actionType,
            payload: request.payload,
          });
        }

        else if(request.actionType === "NewTab"){
         send({
            type: "TAB_ACTIONS",
            actionType: request.actionType,
            payload: request.payload,
          }); 
        }

        else if(request.actionType === "CloseTab"){
         send({
            type: "TAB_ACTIONS",
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