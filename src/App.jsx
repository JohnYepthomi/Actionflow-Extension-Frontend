import Workflow from "./components/Workflow";
import "./App.css";

function App() {

  return (
    <div>
      
      <h2 style={{
        textAlign: "center",
        color: "white"
      }}>Actionflow</h2>
      
      <div style={{
        display: "flex",
        flexDirection : 'column',
        gap: "20px",
        padding: "20px"
      }}>
        <Workflow items={[{name: "click", selector: "test>test>test"}]}/>
      </div>

    </div>
  );
}

export default App;
