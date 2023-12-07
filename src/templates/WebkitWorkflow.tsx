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
  }, [workflow]);

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

  return (
    <VStack id="ported-component" w="100%" h="100%">
      <Actions
        dispatch={send}
        current={current}
        updateAppDatabase={(updatedActions) => {
          updateDebounceRef.current(workflowName, updatedActions);
        }}
      />
      <ActionMenu dispatch={send} />
    </VStack>
  );
};

export default memo(Workflow);
