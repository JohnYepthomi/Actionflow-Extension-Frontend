import { useState } from "react";
import "../styles/recordingbutton.css";
import messageTab from "../utils/messageTab";

export default function RecordingButton({ state, dispatch }) {
  async function handleRecord(e) {
    try {
      if (!state.matches("recording")) {
        await messageTab("start-recording");
        dispatch({ type: "START_RECORD" });
      } else if (state.matches("recording")) {
        await messageTab("stop-recording");
        dispatch({ type: "STOP_RECORD" });
      }
    } catch (err) {
      console.log("Warning: Not Runnning in Chrome Extension context");
      console.log(err);
    }
  }

  return (
    <div className="flex-row mt-5">
      <button onClick={handleRecord} className="rec-button p-1 fw-bold">
        {state.matches("recording") ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
