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
import ActionsView from "../components/ActionFlow/ActionsView";

// Execution Event
import { listen } from "@tauri-apps/api/event";

import { logger } from "../../../logger";
import { VStack, Box } from "@chakra-ui/react";

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
  AppDispatch: any;
  composeStatus: any;
  settingsStore: any;
};

const Workflow = ({
  workflowName,
  workflow,
  AppDispatch,
  composeStatus,
  settingsStore,
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
    const subscription = service.subscribe((state) => {
      console.log("state: ", state.value);
    });

    return subscription.unsubscribe;
  }, []);

  useEffect(() => {
    let unlisten_action_ticker;

    const action_ticker_listener = async () => {
      unlisten_action_ticker = await listen("action-ticker", (event) => {
        console.log("action-ticker: ", event.payload);

        const currentActionId = event.payload;

        if (current.context.currentTaskActionId !== currentActionId) {
          send({
            type: "UPDATE_CURRENT_ACTION_TICKER_ID",
            id: currentActionId,
          });
        }
      });
    };
    action_ticker_listener();

    return () => {
      if (unlisten_action_ticker) unlisten_action_ticker();
    };
  }, []);

  console.log("WebkitWorkflow Rendered");

  const renderWorkflow = useCallback(() => {
    return (
      <VStack id="ported-component" w="100%" h="100%">
        <ActionsView
          key={workflowName}
          dispatch={send}
          current={current}
          updateAppDatabase={(updatedActions) => {
            console.log(
              "Updating Actions to Tauri Database for WorkflowName: ",
              workflowName,
              "and New Workflow: ",
              updatedActions
            );
            updateDebounceRef.current(workflowName, updatedActions);
          }}
          workflowName={workflowName}
          workflow={workflow}
          settingsStore={settingsStore}
        />
      </VStack>
    );
  }, [workflowName, workflow, AppDispatch, composeStatus]);

  return renderWorkflow();
};

export default memo(Workflow);
