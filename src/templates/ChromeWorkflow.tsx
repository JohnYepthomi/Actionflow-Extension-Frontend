import messageTab from "../utils/messageTab";
import messageBackground from "../utils/messageBackground";
import { useEffect, memo } from "react";
import { TRecordableActions } from "../Types/ActionTypes/Action";
import { ActionMenu, ActiveTab, RecordingButton, Actions } from "../components";
import { TAppEvents } from "../Schemas/replaceTypes/StateEvents";
import { Center, Box, Button, HStack, VStack } from "@chakra-ui/react";

const test = [
  { id: "anWFdfgd-dl4-kja-s", actionType: "Click", nestingLevel: 0 },
  { id: "acdWD-ddfgl4-kja-s", actionType: "Click", nestingLevel: 0 },
  { id: "acd-34dl4-qkja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "axr4d-67dl4-kja-sd", actionType: "Click", nestingLevel: 0 },
  { id: "abd-dl4NMX-kja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "acdS-dl4-,Kkja-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "add-4asdls.DF4-kja", actionType: "Click", nestingLevel: 0 },
  { id: "aed-Sdlass3EEQ4-kj", actionType: "Click", nestingLevel: 0 },
  { id: "afd-dSlCCC4s-kja-s", actionType: "Click", nestingLevel: 0 },
  { id: "agd-dl4-kjGGGa-sd2", actionType: "Click", nestingLevel: 0 },
  { id: "ahd-dlSDSs4JTYJY-k", actionType: "Click", nestingLevel: 0 },
  { id: "aid-dl4ASDEEZZ-kja", actionType: "Click", nestingLevel: 0 },
  { id: "ajasSd-dl4-k6745FG", actionType: "Click", nestingLevel: 0 },
  { id: "akd-dSsl4-kjadsSDG", actionType: "Click", nestingLevel: 0 },
  { id: "ald-sdSl4-kja-;P;2", actionType: "Click", nestingLevel: 0 },
  { id: "amd-dl4-kja-zxfsSD", actionType: "Click", nestingLevel: 0 },
  { id: "and-dl4S-kasda3sKJ", actionType: "Click", nestingLevel: 0 },
  { id: "aod-dl4-AAASDG555S", actionType: "Click", nestingLevel: 0 },
  { id: "apcd-dl4-hgja-sd2e", actionType: "Click", nestingLevel: 0 },
  { id: "aqd-dl4-kjasGGGG4d", actionType: "Click", nestingLevel: 0 },
  { id: "ard-dl4-kjamnv-55X", actionType: "Click", nestingLevel: 0 },
  { id: "asAd-dl4-kja-UUIID", actionType: "Click", nestingLevel: 0 },
  { id: "atdA--kja44M77611-", actionType: "Click", nestingLevel: 0 },
  { id: "aud-A4-kja-KOLOsd2", actionType: "Click", nestingLevel: 0 },
  { id: "avad-l4-kjaDHIK-sd", actionType: "Click", nestingLevel: 0 },
  { id: "awd56A4-kja-sSDFGd", actionType: "Click", nestingLevel: 0 },
  { id: "axd-dl2224-k56DSFG", actionType: "Click", nestingLevel: 0 },
  { id: "aydl4-Akja-saDFG2H", actionType: "Click", nestingLevel: 0 },
  { id: "azd-l4-AkCVBTdaaej", actionType: "Click", nestingLevel: 0 },
  { id: "ard-dkjaA-2SDFQ332", actionType: "Click", nestingLevel: 0 },
  { id: "aed-dl4-kAja-66qua", actionType: "Click", nestingLevel: 0 },
  { id: "cs-dlkja-xA22GFH,M", actionType: "Click", nestingLevel: 0 },
  { id: "ct-dl4-kja-Aszxfbc", actionType: "Click", nestingLevel: 0 },
  { id: "ae-dl4-kja-xcxas32", actionType: "Click", nestingLevel: 0 },
  { id: "addl4-kja-qeAr3sfs", actionType: "Click", nestingLevel: 0 },
  { id: "aad-dl4-kjAasdA3xs", actionType: "Click", nestingLevel: 0 },
  { id: "AfDFacd-askja-sd2y", actionType: "Click", nestingLevel: 0 },
];

type TWorkflowParams = { current: any; send: any; service: any };
const ChromeWorkflow = ({ current, send, service }: TWorkflowParams) => {
  useEffect(() => {
    const subscription = service.subscribe((state: any) => {
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
    localStorage.setItem(
      "composeData",
      JSON.stringify(current.context.flowActions)
    );
    const composeData = localStorage.getItem("composeData");
    localStorage.setItem("isComposeCompleted", "true");

    if (composeData) {
      await messageTab({
        message: "compose-completed",
        payload: current.context.flowActions,
      });
    }
  }

  type TRecordedActionFromContentScript = {
    status: "new-recorded-action";
    payload: {
      type: "RECORDED_ACTION";
      payload: { actionType: TRecordableActions; props: any };
    };
  };
  type TActionUpdateFromContentScript = {
    status: "element-action-update";
    payload: TAppEvents;
  };

  function handleChromeRuntimeMessages() {
    console.log("handleChromeRuntimeMessages called");

    chrome.runtime.onMessage.addListener(async function (
      message: TRecordedActionFromContentScript | TActionUpdateFromContentScript
    ) {
      if (message.status === "new-recorded-action") {
        if (message.payload.type !== "RECORDED_ACTION") return;
        // reshape payload for state event compatibility

        send({
          type: "RECORDED_ACTION",
          payload: {
            actionType: message.payload.payload.actionType,
            props: message.payload.payload.props,
          },
        });
      } else if (message.status === "element-action-update") {
        if (message.payload.type === "UPDATE_INTERACTION") {
          send(message.payload);
        }
      }

      // if (message.status === "element-text") {
      // }

      // if (message.status === "current-recording-status") {
      //   send({ type: message.payload ? "START_RECORD" : "STOP_RECORD" });
      // }
    });
  }

  type TActiveTabStorageKey = "lastActiveTabData";
  async function getCurentActiveTab() {
    async function asyncStorageGet(item: TActiveTabStorageKey) {
      return new Promise<any>(function (resolve, reject) {
        chrome.storage.local.get(item, (data) => {
          resolve(data[item]);
        });
      });
    }

    // Update ActiveTab on every tab change
    chrome.storage.onChanged.addListener((changes, _namespace) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === "lastActiveTabData") {
          send({
            type: "UPDATE_ACTIVE_TAB",
            payload: { newTabInfo: newValue },
          });
        }
      }
    });

    const lasActiveData = await asyncStorageGet("lastActiveTabData");
    if (lasActiveData)
      send({
        type: "UPDATE_ACTIVE_TAB",
        payload: { newTabInfo: lasActiveData },
      });
  }

  console.log("Chrome Workflows rendered");

  return (
    <VStack id="ported-component" w="100%" h="100%" px={20}>
      <ActionMenu dispatch={send} />
      <ActiveTab current={current} />
      <RecordingButton current={current} dispatch={send} />
      <Actions dispatch={send} current={current} service={service} />

      <Button
        style={{
          backgroundColor: "#472749",
          color: "gray",
          padding: "10px",
          marginTop: "10px",
        }}
        onClick={handleComposeFinish}
      >
        Done
      </Button>
    </VStack>
  );
};
export default memo(ChromeWorkflow);


