import { ActionMenu, Actions } from "../components";
import { useMachine } from "@xstate/react";
import { AppStateMachine } from "../AppState/state";
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  memo,
  useContext,
} from "react";

// Execution Event
import { listen } from "@tauri-apps/api/event";

// APP STYLES
import appCss from "../App.css?inline";
import wfstyle from "../styles/workflow.css?inline";
import classStyles from "../styles/class-styles.css?inline";
import activeTabStyle from "../styles/activetab.css?inline";
import actionMenuStyle from "../styles/actions-menu.css?inline";
import recordingButtonStyle from "../styles/recordingbutton.css?inline";
import interactionStyle from "../styles/interactions.css?inline";
import conditionalsStyle from "../styles/conditionals.css?inline";
import draganddropStyle from "../styles/draganddrop.css?inline";
import AddStyle from "../components/AddStyle";
import AGCommunity from "ag-grid-community/styles/ag-grid.css?inline";
import AGBalhamDark from "ag-grid-community/styles/ag-theme-balham.min.css?inline";
import { IconContext } from "react-icons";
import { logger } from "../../../logger";

import spinnerCss from "../../../spinner.css?inline";

const combinedStyles =
  AGCommunity +
  AGBalhamDark +
  appCss +
  wfstyle +
  classStyles +
  activeTabStyle +
  actionMenuStyle +
  recordingButtonStyle +
  interactionStyle +
  draganddropStyle +
  conditionalsStyle +
  spinnerCss;

function debounce(fn: any, ms: number) {
  let timer: undefined | number;
  return function () {
    // console.log("timerId: ", timer);
    clearTimeout(timer);
    const context = debounce;
    const args = arguments;

    timer = setTimeout(function () {
      console.log("Workflow: DEBOUNCING DISPATCH, ARGS", args);
      timer = undefined;
      fn.apply(context, args);
    }, ms);
  };
}

type TWorkflowParams = {
  workflowName: string;
  workflow: any;
  setDispatchWorkflow: () => void;
  AppDispatch: any;
  composeStatus: any;
};

const Workflow = ({
  workflowName,
  workflow,
  setDispatchWorkflow,
  AppDispatch,
  composeStatus,
}: TWorkflowParams) => {
  const [current, send, service] = useMachine(AppStateMachine);
  const { flowActions } = current.context;
  const updateDebounceRef = useRef(
    debounce((workflowName, Workflow) => {
      AppDispatch({
        type: "UPDATE_WORKFLOW",
        WorkflowName: workflowName,
        Workflow,
      });
    }, 700)
  );

  useEffect(() => {
    console.log("composeStatus: ", composeStatus);
    if (composeStatus === "composing" && workflow) {
    }

    if (composeStatus === "ok" && workflow) {
      AppDispatch({ type: "RESET_COMPOSE_STATUS" });
      send({ type: "UPDATE_WORKFLOW_FROM_TAURI", workflow });
    }
  }, [composeStatus, workflow]);

  useEffect(() => {
    send({ type: "UPDATE_WORKFLOW_FROM_TAURI", workflow });
  }, []);

  useEffect(() => {
    setDispatchWorkflow((state) => send);
  }, []);

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log("state: ", state.value);
    });

    return subscription.unsubscribe;
  }, []);

  useEffect(() => {
    // UPDATE WORKFLOW ON THE APP DATABASE
    // When user drops an item
    if (flowActions && flowActions.length > 0) {
      console.log("flowActons before app dispatch: ", flowActions);
      updateDebounceRef.current(workflowName, flowActions);
    }
  }, [current.context.itemDroppedToggle]);

  useEffect(() => {
    let unlisten_action_ticker;

    const action_ticker_listener = async () => {
      unlisten_action_ticker = await listen("action-ticker", (event) => {
        console.log("action-ticker: ", event.payload);

        const currentActionId = event.payload;

        if (current.context.currentTaskActionId !== currentActionId) {
          send({ type: "UPDATE_CURRENT_ACTION_TICKER_ID", id: currentActionId });
        }
      });
    };
    action_ticker_listener();

    return () => unlisten_action_ticker();
  }, []);

  return (
    <AddStyle style={combinedStyles}>
      <IconContext.Provider
        value={{
          size: "16px",
          color: "white",
          className: "global-class-name",
        }}
      >
        <div
          id="ported-component"
          className="workflow-container flex-column align-center justify-content gap-1"
        >
          <ActionMenu dispatch={send} />
          <Actions dispatch={send} current={current} />
        </div>
      </IconContext.Provider>
    </AddStyle>
  );
};

export default memo(Workflow);
