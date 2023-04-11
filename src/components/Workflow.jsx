import ActionMenu from "./ActionMenu";
import { useState, useEffect, useRef } from "react";
import InteractionInfo from "./InteractionInfo";
import "../styles/workflow.css";
import messageTab from "../utils/messageTab";
import { Interactions } from "../ActionsDefinitions/definitions";

function WorkflowItem({ actions }) {
  if (!actions) return;

  function handleActionClick(e) {
    e.preventDefault();

    if (!e.currentTarget.classList.contains("action-header")) return;

    const actionHeaderEl = e.currentTarget;
    const actionDetailsEl =
      actionHeaderEl.parentElement.querySelector(".action-details");

    if (actionDetailsEl.style.display === "block") {
      actionDetailsEl.style.display = "none";
    } else {
      actionDetailsEl.style.display = "block";
    }
  }

  return actions.map((action, index) => {
    return (
      <li key={index}>
        <div className="action-header" onClick={handleActionClick}>
          <input type="checkbox" id="accept" name="accept" value="yes" />
          <div className="caption">
            <div className="name">{action.name}</div>
            <div>{action.svg()}</div>
          </div>
        </div>
        {action.actionType === "Interaction" && (
          <InteractionInfo
            actionName={action.name}
            actionProps={action.props}
          />
        )}
      </li>
    );
  });
}

export default function Workflow({ items }) {
  const [actions, setActions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    try {
      handleChromeRuntimeMessages(setActions);
      getRecordingStatus();
    } catch (err) {
      console.log("Warning: Not Runnning in Chrome Extension context");
      console.warn(err);
    }
  }, []);

  async function getRecordingStatus() {
    await messageTab("get-recording-status");
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
      console.warn(err);
    }
  }

  function handleChromeRuntimeMessages(setActions) {
    console.log("handleChromeRuntimeMessages called");

    chrome.runtime.onMessage.addListener(async function (
      request,
      sender,
      sendResponse
    ) {
      if (request.status === "new-recorded-action") {
        const newRecordedAction = request.payload;
        console.log({ newRecordedAction });
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

  return (
    <div>
      <ActionMenu setActions={setActions} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <buton
          onClick={handleRecord}
          style={{
            color: "white",
            backgroundColor: "red",
            padding: "5px",
            outline: "none",
            borderRadius: "3px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </buton>
      </div>

      <div className="workflow-container">WORKFLOW</div>
      <ul className="workflow-ul">
        <WorkflowItem actions={actions} />
      </ul>
    </div>
  );
}
