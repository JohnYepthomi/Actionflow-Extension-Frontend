import {
  ActionMenu,
  Interaction,
  Conditionals,
  ActiveTab,
  RecordingButton,
} from "../components";
import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { AppStateMachine } from "../AppState/state.js";
import messageTab from "../utils/messageTab";
import "../styles/workflow.css";

function Action({ actions, dispatch }) {
  if (!actions) return;

  function toggleActionDetails(e) {
    // e.preventDefault();

    if (!e.currentTarget.classList.contains("action-header")) return;

    const actionHeaderEl = e.currentTarget;
    const actionDetailsEl =
      actionHeaderEl.parentElement.querySelector(".action-details");
    const display = actionDetailsEl.style.display;
    if (display === "" || display === "flex") {
      actionDetailsEl.style.display = "none";
    } else {
      actionDetailsEl.style.display = "flex";
    }
  }

  return actions.map((action, index) => {
    return (
      <li key={index}>
        <div className="action-header gap-1" onClick={toggleActionDetails}>
          <input
            type="checkbox"
            id="accept"
            name="accept"
            value="yes"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-row align-center justify-start gap-1 caption">
            <div className="flex-row align-center justify-center">
              {action.svg()}
            </div>
            <div className="name">{action.event}</div>
            {action?.recorded && <div className="recorded-marker">REC</div>}
          </div>
        </div>
        <div className="action-details flex-column p-2">
          {action.actionType === "INTERACTION" ? (
            <Interaction actionName={action.event} actionProps={action.props} />
          ) : (
            <Conditionals
              conditionType="IF"
              actions={actions}
              actionId={action.id}
              dispatch={dispatch}
            />
          )}
        </div>
      </li>
    );
  });
}

export default function Workflow() {
  const [current, send] = useMachine(AppStateMachine, { devTools: true });
  const { flowActions, activeTab } = current.context;

  useEffect(() => {
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
      await messageTab("get-recording-status");
    } catch (err) {
      console.log(err);
    }
  }

  function handleChromeRuntimeMessages() {
    console.log("handleChromeRuntimeMessages called");

    chrome.runtime.onMessage.addListener(async function (request) {
      if (request.status === "new-recorded-action") {
        send({
          type: "UPDATE_RECORDED_ACTION",
          newRecordedAction: request.payload,
        });
      }

      if (request.status === "current-recording-status") {
        send({ type: request.payload ? "START_RECORD" : "STOP_RECORD" });
      }
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
      <ActionMenu dispatch={send} />
      {activeTab && <ActiveTab currentTab={activeTab} />}
      <RecordingButton state={current} dispatch={send} />
      <div className="workflow-label">WORKFLOWS</div>
      {
        <ul className="workflow-ul">
          <Action actions={flowActions} dispatch={send} />
        </ul>
      }
    </div>
  );
}
