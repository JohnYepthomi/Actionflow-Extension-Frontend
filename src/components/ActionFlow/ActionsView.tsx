import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import ActionHeader from "../WorkflowActions/ActionHeader";
// import ActionDetails from "../WorkflowActions/ActionDetails";
 
//Reactflow Configurations
const initialNodes = [
  { 
    id: '1',
    sourcePosition: 'right',
    type : "input",
    position:{ x: 0, y: 0},
    data: { label: '1'} 
  },
  { 
    id: '2',
    sourcePosition: 'right',
    targetPosition: 'left',
    position: { x: 0, y: 100 },
    data: { label: '2' }
  },
  { id: '3',
    sourcePosition: 'right',
    targetPosition: 'left',
    position: { x: 0, y: 150 },
    data: { label: '2' }
  },
];
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep'
  }
];
const proOptions = { hideAttribution: true };

//Custom Node
const CustomHandles = ({ index, actionType, handleId }) => {
  const style = {borderColor: "green", backgroundColor: "green"};

  //SPECIAL Actions
  if(["IF", "List"].includes(actionType)){
    return (
      <>
        { index > 0 && <Handle id={handleId} type="target" position={Position.Top} style={{...style}} />}
        {<Handle type="source" position={Position.Right} id={handleId} style={{...style}} />}
        {<Handle type="source" position={Position.Left} id={handleId} style={{...style}} />}
      </>
    );
  }

  //Normal Actions
  return (
    <>
      { index > 0 && <Handle id={handleId} type="target" position={Position.Top} style={{...style}} />}
      {<Handle type="source" position={Position.Bottom} id={handleId} style={{...style}} />}
    </>
  );
};

const handleStyle = { left: 10 };
function ActionNode({ data }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
    console.log("ActionNode onChange");
  }, []);
  const { handleId, index, action, current, dispatch } = data;
  const actionType = action.actionType;
 
  return (
    <>
      <ActionHeader action={action} current={current} dispatch={dispatch} />
      <CustomHandles index={index} actionType={actionType} handleId={handleId} />
    </>
  );
}

const nodeTypes = { actionNode: ActionNode };

//Sample Actions
const BrowserActions = [
    {
        "id": "f2dbbf2f-4519-32fa-8143-6d4000570fbb",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "NewTab",
        "props": {
            "url": "https://chat.openai.com/?model=text-davinci-002-render-sha",
            "tabId": 1010957645,
            "windowId": 1010957644
        },
        "marginLeft": 0
    },
    {
        "id": "a934a26b-a8dc-120e-65d1-5c27259c31d9",
        "actionType": "IF",
        "nestingLevel": 0,
        "conditions": [
            {
                "selectedVariable": "",
                "selectedType": "Element",
                "selectedOption": "IsVisible",
                "requiresCheck": true,
                "checkValue": ""
            }
        ],
        "marginLeft": 0
    },
    {
        "id": "4b4cf92f-03b3-b81c-fc2c-9e648592e629",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "div:nth-of-type(2) > div > div > div:nth-of-type(2)",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "ChatGPTHow can I help you today?"
        },
        "marginLeft": 20
    },
    {
        "id": "499d6946-de2f-6cd1-2066-672dab2b081a",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "div:nth-of-type(2) > div > div > div:nth-of-type(2)",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "ChatGPTHow can I help you today?"
        },
        "marginLeft": 20
    },
    {
        "id": "a40f7ff2-d5c1-99a1-5f17-a2d7f5eb266a",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "2781b22b-5548-3c1b-4a69-4ac7b28cfd0d",
        "actionType": "Text",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": "",
            "value": ""
        },
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "6c105df0-c281-b659-96b7-bba81a17fca6",
        "actionType": "Upload",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Path": ""
        },
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "62a3d1dd-0cbe-f8bb-a337-d64e7466dd52",
        "actionType": "Date",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Date": ""
        },
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "b526915e-951b-b086-9172-c4a1ac7a22f2",
        "actionType": "List",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": ""
        },
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "92299a13-924d-70e6-107d-c69c5506647e",
        "actionType": "URL",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": "",
            "value": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "2ddcfd9b-5770-a233-8a6e-97c6dbf755ce",
        "actionType": "Keypress",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Key": "",
            "Wait For Page To Load": false
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "6a422a5e-121d-3d0c-803b-b51af681eadc",
        "actionType": "Hover",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Description": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "9e1f58de-b24b-2cb6-b293-b71b649f3889",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    }
]
//Convert Actions to Nodes and Edges.
const actionsToNodesandEdges = (actions: any) => {
  if(!Array.isArray(actions) || actions.length === 0)
    return [];

  const node_template = (id, data, x, y) => ({
    id,
    sourcePosition: 'bottom',
    targetPosition: 'top',
    position:{ x, y},
    data
  });
  const edge_template = (id, source, target, type) => ({
    id,
    source,
    target,
    type,
    animated: false
  });
  const v_dist = 100;
  const h_dist = 150;

  let edges = [];
  const nodes = actions.map((a, index) => {
    const handleId = `e${index - 1}-${ index }`;
    const data = { handleId, index, action: a, current: null, dispatch: null};

    if(index === 0){
      return {
        type: "actionNode",
        ...node_template(a.id, data, 0, index * v_dist)
      };
    };

    edges.push(
      edge_template(
        handleId,
        actions[index - 1].id,
        a.id,
        'smoothstep'
      )
    );

    return {
      type: "actionNode",
      ...node_template(a.id, data, a.nestingLevel * h_dist, index * v_dist)
    };
  });

  return { nodes, edges };
};


export default function ActionsView() {
  const n_e = actionsToNodesandEdges(BrowserActions);
  console.log({n_e});

  const [nodes, setNodes, onNodesChange] = useNodesState(n_e.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(n_e.edges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      type: 'smoothstep'
    }, eds)),
  [setEdges]);

  useEffect(() => {

  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        snapToGrid
        fitView
      >
        <Controls />
        {/*<MiniMap />*/}
        <Panel position="top-left">bottom-left</Panel>
        <Background variant="" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}