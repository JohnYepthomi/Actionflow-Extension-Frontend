import { useState } from "react";
import messageTab from "../utils/messageTab";

export default function RecordingButton({ currentTab, state, dispatch }) {
  async function handleRecord(e) {
    console.log("handleRecord(e) called");
    try {
      if (!state.matches("recording")) {
        await messageTab({message: "start-recording"});
        dispatch({ type: "START_RECORD" });
      } else if (state.matches("recording")) {
        await messageTab({message: "stop-recording"});
        dispatch({ type: "STOP_RECORD" });
      }
    } catch (err) {
      console.log("Warning: Possibly Not Runnning in Chrome Extension context");
      console.log(err);
    }
  }

  return (
    <div className="flex-row mt-5">
      <button onClick={handleRecord} className="rec-button p-1 fw-bold" disabled={ currentTab?.title ? false : true }>
        {state.matches("recording") ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
