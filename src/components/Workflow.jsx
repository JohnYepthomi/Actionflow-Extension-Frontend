import ActionMenu from "./ActionMenu";
import InteractionInfo from "./InteractionInfo";
import ConditionalsInfo from "./ConditionalsInfo";
import { Interactions } from "../ActionsDefinitions/definitions";
import { useState, useEffect } from "react";
import messageTab from "../utils/messageTab";
import "../styles/workflow.css";

function WorkflowItem({ actions, setActions }) {
  if (!actions) return;

  function handleActionClick(e) {
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
        <div className="action-header" onClick={handleActionClick}>
          <input type="checkbox" id="accept" name="accept" value="yes" />
          <div className="caption">
            <div className="name">{action.name}</div>
            <div className="flex-row align-center justify-center">
              {action.svg()}
            </div>
          </div>
        </div>
        {action.actionType === "Interactions" && (
          <InteractionInfo
            actionName={action.name}
            actionProps={action.props}
          />
        )}
        {action.actionType === "Conditionals" && (
          <ConditionalsInfo
            conditionType="IF"
            setActions={setActions}
            actions={actions}
            actionId={action.id}
          />
        )}
      </li>
    );
  });
}

export default function Workflow() {
  const [actions, setActions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState();

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

  async function handleRecord(e) {
    try {
      if (!isRecording) {
        await messageTab("start-recording");
        setIsRecording((state) => (state = true));
      } else {
        await messageTab("stop-recording");
        setIsRecording((state) => (state = false));
      }
    } catch (err) {
      console.log("Warning: Not Runnning in Chrome Extension context");
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
        newRecordedAction["svg"] = Interactions.filter(
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
      var getValue = new Promise(function (resolve, reject) {
        chrome.storage.local.get(item, (data) => {
          resolve(data[item]);
        });
      });

      let gV = await getValue;
      return gV;
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
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px 30px",
        color: "white",
        flexDirection: "column",
        gap: "3px",
      }}
    >
      <ActionMenu setActions={setActions} />

      {/* Active Tab View */}
      {activeTab && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <div style={{ fontWeight: "bold", color: "white", padding: "5px" }}>
            Active Tab
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "3px",
              gap: "5px",
            }}
          >
            <img
              src={activeTab.icon}
              alt="Active Tab favicon"
              width="15px"
              height="15px"
            />
            <div
              style={{
                fontWeight: "bold",
                textOverflow: "ellipsis",
                color: "lightgray",
                overflow: "hidden",
                width: "35vw",
                whiteSpace: "nowrap",
              }}
            >
              {activeTab.title}
            </div>
          </div>
        </div>
      )}

      {/* Recording Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={handleRecord}
          style={{
            color: "white",
            backgroundColor: "red",
            padding: "5px",
            outline: "none",
            borderRadius: "3px",
            border: "none",
            cursor: "pointer",
            width: "100px",
            fontWeight: "bold",
          }}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      <div className="workflow-container">WORKFLOWS</div>

      {/* Workflows */}
      {actions.length > 0 && (
        <ul className="workflow-ul">
          <WorkflowItem actions={actions} setActions={setActions} />
        </ul>
      )}
    </div>
  );
}
