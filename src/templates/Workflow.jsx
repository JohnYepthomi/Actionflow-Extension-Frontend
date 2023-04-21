import {
  ActionMenu,
  Interaction,
  Conditionals,
  ActiveTab,
  RecordingButton,
} from "../components";
import { useState, useEffect } from "react";
import { InteractionDefintions } from "../ActionsDefinitions/definitions";
import messageTab from "../utils/messageTab";
import "../styles/workflow.css";
import { useMachine } from "@xstate/react";
import { AppStateMachine } from "../AppState/state.js";

function Action({ actions, dispatch }) {
  if (!actions) return;

  function toggleActionDetails(e) {
    e.preventDefault();

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
        <div className="action-header" onClick={toggleActionDetails}>
          <input type="checkbox" id="accept" name="accept" value="yes" />
          <div className="flex-row align-center justify-center gap-1 caption">
            <div className="flex-row align-center justify-center">
              {action.svg()}
            </div>
            <div className="name">{action.name}</div>
          </div>
        </div>
        <div className="action-details flex-column p-2">
          {action.actionType === "INTERACTION" ? (
            <Interaction actionName={action.name} actionProps={action.props} />
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
  const [actions, setActions] = useState([]);
  const [activeTab, setActiveTab] = useState();
  const [current, send] = useMachine(AppStateMachine, { devTools: true });
  const { flowActions } = current.context;

  useEffect(() => {
    try {
      handleChromeRuntimeMessages(setActions);
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

  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  }

  function handleChromeRuntimeMessages(setActions) {
    console.log("handleChromeRuntimeMessages called");

    chrome.runtime.onMessage.addListener(async function (
      request,
      _sender,
      _sendResponse
    ) {
      if (request.status === "new-recorded-action") {
        const newRecordedAction = request.payload;
        console.log({ newRecordedAction });
        // Give it an ID
        newRecordedAction["id"] = guidGenerator();

        // Append Action Icon
        newRecordedAction["svg"] = InteractionDefintions.filter(
          (idata) =>
            idata.name.toLowerCase() === newRecordedAction.name.toLowerCase()
        )[0].svg;
        setActions((state) => (state = [...state, newRecordedAction]));
      }

      if (request.status === "current-recording-status") {
        setIsRecording((state) => (state = request.payload));
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

    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (let [key, { _oldValue, newValue }] of Object.entries(changes)) {
        if (key === "lastActiveTabData") {
          setActiveTab((state) => (state = newValue));
        }
      }
    });

    const lasActiveData = await asyncStorageGet("lastActiveTabData");
    if (lasActiveData) setActiveTab((state) => (state = lasActiveData));
  }

  return (
    current.matches("idle") && (
      <div className="workflow-container flex-column align-center justify-content gap-1">
        <ActionMenu dispatch={send} />
        {activeTab && <ActiveTab currentTab={activeTab} />}
        <RecordingButton />
        <div className="workflow-label">WORKFLOWS</div>
        {
          <ul className="workflow-ul">
            <Action actions={flowActions} dispatch={send} />
          </ul>
        }
      </div>
    )
  );
}
