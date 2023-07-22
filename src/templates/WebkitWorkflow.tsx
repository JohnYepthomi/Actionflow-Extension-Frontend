import { ActionMenu, Actions } from "../components";
import { useMachine } from "@xstate/react";
import { AppStateMachine } from "../AppState/state.js";
import { useRef, useEffect, memo, useContext } from "react";

// Actionflow State Import
import { GlobalStateContext } from "../../StateMachine/globalState";
import { useSelector } from "@xstate/react";

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

const combinedStyles =
  appCss +
  wfstyle +
  classStyles +
  activeTabStyle +
  actionMenuStyle +
  recordingButtonStyle +
  interactionStyle +
  draganddropStyle +
  conditionalsStyle;

function debounce(fn, ms) {
  let timer;
  return function () {
    // console.log("timerId: ", timer);
    clearTimeout(timer);
    const context = this;
    const args = arguments;

    timer = setTimeout(function () {
      console.log("Workflow: DEBOUNCING DISPATCH, ARGS", args);
      timer = null;
      fn.apply(context, args);
    }, ms);
  };
}

const Workflow = ({
  workflowName,
  setDispatchWorkflow,
  setLocalActions,
  setRunDisabled,
}) => {
  const [current, send, service] = useMachine(AppStateMachine);
  const { flowActions } = current.context;

  const updateDebounceRef = useRef(
    debounce((send, workflowName, Workflow, db) => {
      send({ type: "INSERT_TO_DB", workflowName, Workflow, db });
    }, 700)
  );
  const globalServices = useContext(GlobalStateContext);
  const DB = useSelector(
    globalServices.appService,
    (state) => state.context.db
  );
  useEffect(() => {
    console.log(setDispatchWorkflow);
    setDispatchWorkflow((state) => send);
    // send({type: "CREATE_TABLE", workflowName, db: DB});
    if (current.matches("restoring"))
      send({ type: "RESTORE_ACTIONS", workflowName, db: DB });
  }, []);
  useEffect(() => {
    const subscription = service.subscribe((state) => {
      console.log("state: ", state.value);
    });

    return subscription.unsubscribe;
  }, []);
  useEffect(() => {
    setLocalActions((state) => flowActions);
    setRunDisabled((state) => flowActions && flowActions.length > 0);
    updateDebounceRef.current(send, workflowName, flowActions, DB);
  }, [flowActions]);

  console.log("Workflow Rendered, workflowName: ", workflowName);

  return (
    <AddStyle style={combinedStyles}>
      <div
        id="ported-component"
        className="workflow-container flex-column align-center justify-content gap-1"
      >
        <ActionMenu dispatch={send} />

        {/* <div> */}
        {/*   <button */}
        {/*     className="flex-row align-center justify-content" */}
        {/*     style={{ */}
        {/*       width: '100%', */}
        {/*       backgroundColor: 'red', */}
        {/*       color: 'white' */}
        {/*     }} */}
        {/*     onClick={ */}
        {/*       () => send({type: 'CLEAR_WORKFLOW', workflowName, db: DB}) */}
        {/*     }> */}
        {/*       Add To Trash */}
        {/*       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2-fill" viewBox="0 0 16 16"> */}
        {/*         <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/> */}
        {/*       </svg> */}
        {/*     </button> */}
        {/* </div> */}

        <Actions actions={flowActions} dispatch={send} current={current} />
      </div>
    </AddStyle>
  );
};

export default memo(Workflow);
