import { useState } from "react";
import "../styles/recordingbutton.css";

export default function RecordingButton() {
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <div className="flex-row mt-5">
      <button onClick={handleRecord} className="rec-button p-1 fw-bold">
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
