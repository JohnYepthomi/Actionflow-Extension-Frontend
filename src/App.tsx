import ChromeWorkflow from "./templates/ChromeWorkflow";
import { useMachine } from "@xstate/react";
import { AppStateMachine } from "./AppState/state";
import ActionsView from "./components/ActionFlow/ActionsView";

function App() {
  const [current, send, service] = useMachine(AppStateMachine);
  // return <ChromeWorkflow current={current} send={send} service={service} />;
  return <ActionsView />;
}

export default App;
