import messageTab from "../utils/messageTab";
import React from "react";

const RecordingButton = ({ current, dispatch }) => {
  const { activeTab } = current.context;

  console.log("RecordingButton rendered");

  const handleRecord = React.useCallback(async (e) => {
    console.log("handleRecord(e) called");
    try {
      if (!current.matches("recording")) {
        await messageTab({ message: "start-recording" });
        dispatch({ type: "START_RECORD" });
      } else if (current.matches("recording")) {
        await messageTab({ message: "stop-recording" });
        dispatch({ type: "STOP_RECORD" });
      }
    } catch (err) {
      console.log(
        "Warning: Possibly Not Runnning in Chrome Extension context. Calling handleRecord fn"
      );
      console.log(err);
    }
  }, []);

  return (
    <div className="record-container p-2">
      <button
        onClick={handleRecord}
        data-status={current.matches("recording") ? "recording" : "stopped"}
        className="rec-button flex-column align-center"
        disabled={activeTab?.title ? false : true}
      >
        {current.matches("recording") ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="currentColor"
              className="bi bi-stop-btn"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5h-3z" />
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="currentColor"
              className="bi bi-record-btn"
              viewBox="0 0 16 16"
            >
              <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default React.memo(RecordingButton);
