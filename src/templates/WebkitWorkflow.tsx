// import { ActionMenu, Actions } from "../components";
// import { useMachine } from "@xstate/react";
// import { AppStateMachine } from "../AppState/state.js";
// import { useRef, useEffect, memo, useContext } from "react";

// // Actionflow State Import
// import { GlobalStateContext } from "../../StateMachine/globalState";
// import { useSelector } from "@xstate/react";

// // APP STYLES
// import appCss from "../App.css?inline";
// import wfstyle from "../styles/workflow.css?inline";
// import classStyles from "../styles/class-styles.css?inline";
// import activeTabStyle from "../styles/activetab.css?inline";
// import actionMenuStyle from "../styles/actions-menu.css?inline";
// import recordingButtonStyle from "../styles/recordingbutton.css?inline";
// import interactionStyle from "../styles/interactions.css?inline";
// import conditionalsStyle from "../styles/conditionals.css?inline";
// import draganddropStyle from "../styles/draganddrop.css?inline";
// import AddStyle from "../components/AddStyle";
// import AGCommunity from "ag-grid-community/styles/ag-grid.css?inline";
// import AGBalhamDark from "ag-grid-community/styles/ag-theme-balham.min.css?inline";
// import { IconContext } from "react-icons";
// import { logger } from "../../../logger";

// const combinedStyles =
//   AGCommunity +
//   AGBalhamDark +
//   appCss +
//   wfstyle +
//   classStyles +
//   activeTabStyle +
//   actionMenuStyle +
//   recordingButtonStyle +
//   interactionStyle +
//   draganddropStyle +
//   conditionalsStyle;

// function debounce(fn: any, ms: number) {
//   let timer: undefined | number;
//   return function () {
//     // console.log("timerId: ", timer);
//     clearTimeout(timer);
//     const context = debounce;
//     const args = arguments;

//     timer = setTimeout(function () {
//       console.log("Workflow: DEBOUNCING DISPATCH, ARGS", args);
//       timer = undefined;
//       fn.apply(context, args);
//     }, ms);
//   };
// }

// type TWorkflowParams = {
//   workflowName: string;
//   setDispatchWorkflow: () => void;
//   setLocalActions: () => void;
//   setRunDisabled: () => void;
// };

// const Workflow = ({
//   workflowName,
//   setDispatchWorkflow,
//   setLocalActions,
//   setRunDisabled,
// }: TWorkflowParams) => {
//   const [current, send, service] = useMachine(AppStateMachine);
//   const { flowActions } = current.context;
//   const updateDebounceRef = useRef(
//     debounce((send, workflowName, Workflow, db) => {
//       send({ type: "INSERT_TO_DB", workflowName, Workflow, db });
//     }, 700)
//   );
//   const globalServices = useContext(GlobalStateContext);
//   const DB = useSelector(
//     globalServices.appService,
//     (state) => state.context.db
//   );

//   logger.log(`[${workflowName}] =====rendered===== WORKFLOW COMPONENT`);

//   useEffect(() => {
//     // CREATE IF NOT EXISTS: Ensures there is a table named 'workflows' to work with
//     send({ type: "CREATE_WORKFLOW", db: DB });
//     setDispatchWorkflow((state) => send);

//     if (current.matches("restoring")) {
//       send({ type: "RESTORE_ACTIONS", workflowName, db: DB });
//     }
//   }, []);

//   useEffect(() => {
//     const subscription = service.subscribe((state) => {
//       console.log("state: ", state.value);
//     });

//     return subscription.unsubscribe;
//   }, []);

//   useEffect(() => {
//     setLocalActions((state) => flowActions);
//     setRunDisabled((state) => flowActions && flowActions.length > 0);
//     updateDebounceRef.current(send, workflowName, flowActions, DB);
//   }, [flowActions]);

//   console.log("Workflow Rendered, workflowName: ", workflowName);

//   return (
//     <AddStyle style={combinedStyles}>
//       <IconContext.Provider
//         value={{
//           size: "16px",
//           color: "white",
//           className: "global-class-name",
//         }}
//       >
//         <div
//           id="ported-component"
//           className="workflow-container flex-column align-center justify-content gap-1"
//         >
//           <ActionMenu dispatch={send} />
//           <Actions dispatch={send} current={current} />
//         </div>
//       </IconContext.Provider>
//     </AddStyle>
//   );
// };

// export default memo(Workflow);
