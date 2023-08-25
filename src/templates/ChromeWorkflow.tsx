import messageTab from "../utils/messageTab";
import messageBackground from "../utils/messageBackground";
import { useEffect, memo } from "react";
import { TRecordableActions } from "../Types/ActionTypes/Action";
import { ActionMenu, ActiveTab, RecordingButton, Actions } from "../components";

const test = [
  { id: "anWFdfgd-dl4-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acdWD-ddfgl4-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-34dl4-qkja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "axr4d-67dl4-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4NMX-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acdS-dl4-,Kkja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-4asdls.DF4-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-Sdlass3EEQ4-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dSlCCC4s-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4-kjGGGa-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dlSDSs4JTYJY-k3ja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4ASDEEZZ-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acasSd-dl4-k6745FGj3a-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dSsl4-kjadsSDGF-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-sdSl4-kja-;P;PIOPUIOsd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4-kja-zxfsSDFBCE33d2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4S-kasda3sKJKIja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4-AAASDG555Skjaa-sd2", actionType: "Click", nestingLevel: 0 },
  {
    id: "aAcd-dl4-hgja-sd2",
    actionType: "Click",
    nestingLevel: 0,
  },
  { id: "acd-dl4-kjasGGGG4da-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4-kjamnv-55XXBBsd2", actionType: "Click", nestingLevel: 0 },
  { id: "acAd-dl4-kja-UUIIDFszd2", actionType: "Click", nestingLevel: 0 },
  { id: "acdA--kja44M77611-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-A4-kja-KOLOsd2", actionType: "Click", nestingLevel: 0 },
  { id: "acad-l4-kjaDHIK-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd56A4-kja-sSDFGd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl2224-k56DSFG3ja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acdl4-Akja-saDFG2H4sb3dsd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-l4-AkCVBTdaaeja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dkjaA-2SDFQ332z2sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4-kAja-66,,,sdasd2", actionType: "Click", nestingLevel: 0 },
  { id: "cd-dlkja-xA22GFH,M,Gsd2", actionType: "Click", nestingLevel: 0 },
  { id: "cd-dl4-kja-Aszxfbccd2", actionType: "Click", nestingLevel: 0 },
  { id: "ac-dl4-kja-xcxas32sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acdl4-kja-qeAr3sfsd2", actionType: "Click", nestingLevel: 0 },
  { id: "acd-dl4-kjAasdA3xsf-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "AADFacd-askja-sd2", actionType: "Click", nestingLevel: 0 },
];

const ChromeWorkflow = ({ current, send, service }) => {
  useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log("state: ", state.value);
    });

    return subscription.unsubscribe;
  }, []);

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
      const response = await messageBackground({
        message: "bg-recording-status",
      });
      if (response.recording) {
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

    chrome.runtime.onMessage.addListener(async function (message: {
      status: string;
      actionType: TRecordableActions;
      payload: any;
    }) {
      if (message.status === "new-recorded-action") {
        send({
          type: "RECORDED_ACTION",
          actionType: message.actionType,
          payload: message.payload,
        });
      }

      // if (message.status === "current-recording-status") {
      //   send({ type: message.payload ? "START_RECORD" : "STOP_RECORD" });
      // }
    });
  }

  type TActiveTabStorageKey = "lastActiveTabData";
  async function getCurentActiveTab() {
    async function asyncStorageGet(item: TActiveTabStorageKey) {
      return new Promise(function (resolve, reject) {
        chrome.storage.local.get(item, (data) => {
          resolve(data[item]);
        });
      });
    }

    // Update ActiveTab on every tab change
    chrome.storage.onChanged.addListener((changes, _namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
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
    <div
      id="ported-component"
      className="workflow-container flex-column align-center justify-content"
    >
      <ActionMenu dispatch={send} />
      <ActiveTab current={current} />
      <RecordingButton current={current} dispatch={send} />
      <Actions dispatch={send} current={current} />
      {/* <button
        style={{
          backgroundColor: "#472749",
          color: "gray",
          padding: "10px",
          marginTop: "10px",
        }}
        onClick={handleComposeFinish}
      >
        Done
      </button> */}
    </div>
  );
};

export default memo(ChromeWorkflow);
