import ChromeWorkflow from "./templates/ChromeWorkflow";
// import WebkitWorkflow from "./templates/WebkitWorkflow";
import { useMachine } from "@xstate/react";
import { AppStateMachine } from "./AppState/state";

// APP STYLES
import appCss from "./App.css?inline";
import wfstyle from "./styles/workflow.css?inline";
import classStyles from "./styles/class-styles.css?inline";
import activeTabStyle from "./styles/activetab.css?inline";
import actionMenuStyle from "./styles/actions-menu.css?inline";
import recordingButtonStyle from "./styles/recordingbutton.css?inline";
import interactionStyle from "./styles/interactions.css?inline";
import conditionalsStyle from "./styles/conditionals.css?inline";
import draganddropStyle from "./styles/draganddrop.css?inline";
import AddStyle from "./components/AddStyle";

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

function App() {
  const [current, send, service] = useMachine(AppStateMachine);
  // const isWebkit =
  //   /Safari/.test(navigator.userAgent) &&
  //   /Apple Computer/.test(navigator.vendor);
  // const isChrome =
  //   /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

  // if(isWebkit)
  //   return (
  //     <AddStyle style={combinedStyles}>
  //       <WebkitWorkflow current={current} send={send} service={service} />
  //     </AddStyle>
  //   );

  // else if(isChrome)
  type Tc = typeof current;
  return (
    <AddStyle style={combinedStyles}>
      <ChromeWorkflow current={current} send={send} service={service} />
    </AddStyle>
  );
}

export default App;
