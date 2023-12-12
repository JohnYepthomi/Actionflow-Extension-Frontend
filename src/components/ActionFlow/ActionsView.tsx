import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    EdgeChange,
    Handle,
    MiniMap,
    Node,
    NodeChange,
    Panel,
    Position,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    useEdgesState,
    useNodesState,
    useOnSelectionChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TAction } from "../../Schemas/replaceTypes/Actions";
import ActionHeader from "../WorkflowActions/ActionHeader";
import { motion } from 'framer-motion';
import ActionEdge from "./ActionEdge";
import ActionNode from "./ActionNode";
import { EvaluateNesting } from "../../AppState/state";
// import ActionDetails from "../WorkflowActions/ActionDetails";

const proOptions = { hideAttribution: true };
const handleStyle = { left: 10 };

const nodeType = { actionNode: ActionNode };
const edgeType = { actionEdge: ActionEdge };

// const BrowserActions: any = [
//     {
//         "id": "292cc448-34ca-f427-0dd1-c239650f51be",
//         "recorded": true,
//         "nestingLevel": 0,
//         "actionType": "NewTab",
//         "props": {
//             "url": "https://github.com/",
//             "tabId": 1010961446,
//             "windowId": 1010961395
//         },
//         "marginLeft": 0
//     },
//     {
//         "id": "82f112ae-8990-4d26-0e0b-909ab6d4bbcc",
//         "recorded": true,
//         "nestingLevel": 0,
//         "actionType": "Click",
//         "props": {
//             "nodeName": "INPUT",
//             "selector": "input[aria-label=\"Find a repository…\"]",
//             "Wait For New Page To Load": false,
//             "Wait For File Download": false,
//             "Description": "Find a repository…"
//         },
//         "marginLeft": 0
//     },
//     {
//         "id": "38bf9285-ef73-0b73-076b-5206b34fe08c",
//         "actionType": "IF",
//         "nestingLevel": 0,
//         "conditions": [
//             {
//                 "selectedVariable": "",
//                 "selectedType": "Element",
//                 "selectedOption": "IsVisible",
//                 "requiresCheck": true,
//                 "checkValue": ""
//             }
//         ],
//         "marginLeft": 0
//     },
//     {
//         "id": "c3e51bd4-cd1f-fd82-2265-e739bdb7e554",
//         "actionType": "Date",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Date": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "afa5c569-0218-d8ee-0a10-d82e890ee6b1",
//         "actionType": "Upload",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Path": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "8bce5fa0-5a88-fd18-e807-ec33e96b6a97",
//         "actionType": "END",
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "1a97df89-8793-ae90-97bc-fecb98320cba",
//         "actionType": "Anchor",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "variable": "",
//             "value": ""
//         },
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "92a2a860-0b5a-067d-bce6-a8be10c2667b",
//         "actionType": "Code",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Code": ""
//         },
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "7d2357ee-ec41-b06f-94d2-3d27de1851c8",
//         "actionType": "List",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "variable": ""
//         },
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "14f6a163-2cd0-eea8-544d-e4522e160b8b",
//         "actionType": "Date",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Date": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "2498e40c-50d8-b8da-b933-b264adefb4ca",
//         "actionType": "Prompts",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Response Type": {
//                 "Accept": false,
//                 "Decline": false
//             },
//             "Response Text": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "53b5bd45-a3f8-21b2-6d0c-8bfad1c48274",
//         "actionType": "END",
//         "nestingLevel": 0,
//         "marginLeft": 0
//     }
// ]

const BrowserActions: any = [
    {
        "id": "6fcfad09-774d-7e60-ec73-4df71570d9e3",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "TEXTAREA",
            "selector": "textarea[aria-label=\"Search\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Search"
        },
        "marginLeft": 0
    },
    {
        "id": "899966c2-15db-19f4-4953-3226aac864e0",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Type",
        "props": {
            "nodeName": "TEXTAREA",
            "selector": "textarea[aria-label=\"Search\"]",
            "Text": "go to shop",
            "Overwrite Existing Text": false
        },
        "marginLeft": 0
    },
    {
        "id": "b87371ea-d863-0398-f89b-edc0182a233a",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Navigate",
        "props": {
            "url": "https://github.com/",
            "tabId": 1010961496,
            "windowId": 1010961395
        },
        "marginLeft": 0
    },
    {
        "id": "8e94110c-6d47-2644-21fa-875aa64936c8",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Navigate",
        "props": {
            "url": "https://github.com/",
            "tabId": 1010961496,
            "windowId": 1010961395
        },
        "marginLeft": 0
    },
    {
        "id": "fa22ae91-fdd9-ccad-5e5e-4462f689f594",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "div:nth-of-type(2) > div",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Home\n\n  \n  \n\n\n        \n          \n\n    \n    \n        \n          \n    \n\n        \n      \n        \n          Issues\n\n  \n  \n\n\n        \n          \n\n    \n    \n        \n          \n    \n\n        \n      \n        \n          Pull requests\n\n  \n  \n\n\n        \n          \n\n    \n    \n        \n          \n    \n\n        \n      \n        \n          Projects\n\n  \n  \n\n\n        \n          \n\n    \n    \n        \n          \n    \n\n        \n      \n        \n          Discussions\n\n  \n  \n\n\n        \n          \n\n    \n    \n        \n          \n    \n\n        \n      \n        \n          Codespaces\n\n  \n  \n\n\n        \n          \n        \n          \n\n    \n    \n        \n          \n    \n\n        \n      \n        \n          Explore\n\n  \n  \n\n\n        \n          \n\n    \n    \n        \n          \n    \n\n        \n      \n        \n          Marketplace"
        },
        "marginLeft": 0
    },
    {
        "id": "33ed307c-0b15-4f3b-4105-28d895d13951",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "svg",
            "selector": "button[aria-label=\"Close\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": ""
        },
        "marginLeft": 0
    },
    {
        "id": "5675b609-5796-7306-c0fe-ab4ac6952287",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "BUTTON",
            "selector": "button[aria-label=\"Open global navigation menu\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Open global navigation menu"
        },
        "marginLeft": 0
    },
    {
        "id": "cf7de2ed-9d1d-7831-9b26-8cdedb166135",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "svg",
            "selector": "button[aria-label=\"Close\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": ""
        },
        "marginLeft": 0
    },
    {
        "id": "fb76a14c-fb33-7d58-1de2-de5c28feee10",
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
        "id": "2e7071d5-a26a-71a6-eea0-11b430a15ff6",
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
        "id": "b5783e82-8d1c-5c84-cd9d-36a4e16eb009",
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
        "id": "64b57e9e-bcd8-260c-f47e-35d11d1c7ba2",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "0e1e1ba0-53a1-7370-27c4-fe76adaf713e",
        "actionType": "Anchor",
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
        "id": "38d8ab9f-ac20-9744-1766-ea12101e0e4c",
        "actionType": "URL",
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
        "id": "4729bfcb-32c7-18c5-b48d-8001585c63f7",
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
        "id": "dfc10c60-c6f2-f060-0b5c-625afc598c1f",
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
        "id": "ddd393de-9385-725d-c4e8-90ea00a79f32",
        "actionType": "Text",
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
        "id": "a117ed0f-ca93-4747-a547-3b6dc86690be",
        "actionType": "Date",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Date": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "695d99e8-686c-7337-9ee7-fe22542d26a4",
        "actionType": "Upload",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Path": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "2974b969-e5aa-3f33-91c7-f3a0ddb747c3",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "16faa417-3124-1eba-9776-2f84184562f0",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "c6ef91d6-1686-bc1b-a2cb-a09f8a65b1e0",
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
        "id": "68df2b3d-0ce0-1beb-3e5e-266707f7009b",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "INPUT",
            "selector": "input[aria-label=\"Find a repository…\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Find a repository…"
        },
        "marginLeft": 20
    },
    {
        "id": "cdbe9937-5db2-8d39-621a-7f26dea82561",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Type",
        "props": {
            "nodeName": "INPUT",
            "selector": "input[aria-label=\"Find a repository…\"]",
            "Text": "asd",
            "Overwrite Existing Text": false
        },
        "marginLeft": 20
    },
    {
        "id": "40289be8-e37c-d3aa-1ac7-e096bec2e2b2",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "BUTTON",
            "selector": "button[aria-label=\"Search or jump to…\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Search or jump to…"
        },
        "marginLeft": 20
    },
    {
        "id": "42702c19-69d8-e66b-d4a2-83c23dfd514b",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "SPAN",
            "selector": "li[aria-label=\"srevinsaju, jump to this owner\"] > a > span:nth-of-type(2) > span",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "srevinsaju"
        },
        "marginLeft": 20
    },
    {
        "id": "b7fa3816-9063-6b70-17ed-41bfc87f7d56",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Navigate",
        "props": {
            "url": "https://github.com/srevinsaju",
            "tabId": 1010961496,
            "windowId": 1010961395
        },
        "marginLeft": 20
    }
];

export type TNodeData = {
    isDragging: boolean;
    index: number;
    hideTopHandle: boolean;
    action: TAction;
    current: any;
    dispatch: any;
}

const node_template = (
    id: string,
    data: TNodeData,
    x: number,
    y: number,
) => ({
    id,
    position: { x, y },
    data,
});

type TEdgeData = {
    offset: number | null;
    isRedEdge: boolean;
};
const edge_template = (
    id: string,
    data: TEdgeData,
    source: string,
    target: string,
    sourceHandle: string,
    type: string,
    label: string,
    style: React.CSSProperties,
    animated: boolean
) => ({
    id,
    data,
    source,
    target,
    sourceHandle,
    type,
    label,
    style,
    animated: animated ? animated : false,
});
const nextOfEndActionTargetId = (id: string, actions: TAction[]) => {
    console.log("called nextOfEndActionTargetId");
    let targetActionId: number | null = null;

    let ifNestingLevel: number | null = null;
    actions.forEach((curr_action, index) => {
        if(targetActionId || !curr_action)
            return;

        if(curr_action.id === id){
            ifNestingLevel = curr_action.nestingLevel;
            return;
        }

        if(curr_action.actionType === "END" && curr_action.nestingLevel === ifNestingLevel){
            targetActionId = index;
            return;
        }
    });

    return targetActionId;
};

type TCreatedNodesAndEdges = { nodes: Node[]; edges: Edge[]; } | null ;
const actionsToFlowWithNullItems = (actions: any) : TCreatedNodesAndEdges => {
    console.log("called actionsToFlow");

    if (!Array.isArray(actions) || actions.length === 0){
        console.warn("[warning] fn actionsToFlow: passed bad argument - (actions: TAction[])");
        return null;
    }

    const v_dist = 100;
    const h_dist = 200;

    let edges: Edge[] = [];
    let indexBeforeNull: number | null = null;

    const nodes: any = actions.map((a, index) => {
        if(!a){
            if(actions[index - 1]){
                indexBeforeNull = index - 1;
            }
            return null;
        }

        if (index > 0) {
            const prevIndex = actions[index - 1] ? index - 1 : indexBeforeNull;
            if(prevIndex !== null){
                const prevAction = actions[prevIndex];
                const prevActionType = prevAction.actionType;
                const edgeId = `e${prevIndex}-${index}`;

                // Adding an extra edge for special actions
                if (["IF"].includes(prevActionType)) {
                    const redEdgeTargetId = nextOfEndActionTargetId(prevAction.id, actions);
                    if(redEdgeTargetId !== null){
                        edges.push(edge_template(
                            `e${prevIndex}-${redEdgeTargetId}`, //id
                            {offset: (redEdgeTargetId - prevIndex) * 100 , isRedEdge: true}, //data
                            String(prevIndex), //source id
                            String(redEdgeTargetId), //target id
                            actions[prevIndex].id + prevActionType, //sourceHandle id
                            'actionEdge', //Connection Line type
                            String(redEdgeTargetId), //label
                            { stroke: "red" }, //stroke color
                            false, //animated?
                        ));
                    }
                }

                edges.push(
                    edge_template(
                        edgeId, //id
                        {offset: null, isRedEdge: false}, // data
                        String(prevIndex), //source id
                        String(index), //target id
                        actions[prevIndex].id, //sourceHandle id
                        'actionEdge', //Connection Line type
                        String(index), //label
                        { stroke: "lightgreen" }, //stroke color,
                        false, //animated? 
                    )
                );
            }
        }

        const node_x = 
            index === 0 
                ? 0 
                // : a.actionType === "END" 
                //     ? a.nestingLevel + 1 * h_dist
                    : a.nestingLevel * h_dist;
        const node_y = index * v_dist;
        const data = {
            isDragging: false,
            index,
            action: a,
            current: null,
            hideTopHandle: index === 0 || index === 1 && !actions[index - 1] ? true : false,
            dispatch: null
        };

        return {
            type: "actionNode",
            ...node_template(
                String(index),
                data,
                node_x,
                node_y,
            )
        } satisfies Node;
    });

    return { nodes: nodes.filter((n: any) => n), edges };
};

const SelectionTest = () => {
    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            console.log("[useOnSelectionChange] nodes: ", nodes, ", edges: ", edges);

            // setEdges(edges.map((edge) => {
                
            // }));
        },
    });

    return null;
};

export default function ActionsView(): JSX.Element | null {
    const n_e = useMemo(() => actionsToFlowWithNullItems(EvaluateNesting(BrowserActions)), []);
    const [nodes, setNodes, onNodesChange] = useNodesState(n_e ? n_e.nodes : []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(n_e ? n_e.edges : []);
    const draggedNodeRestore = useRef<{ nodes: Node[]; edges: Edge[]; } | null>();

    const onConnect = useCallback(
        (params: any) => 
            setEdges((eds: Edge[]) => addEdge({
                ...params,
                animated: true,
                type: 'smoothstep'
            }, eds)),
        [setEdges]);

    const onSelectionDragStart = useCallback((event: React.MouseEvent, _nodes: Node[]) => {
        console.log("[onSelectionDragStart] nodes", nodes);

        const top: Node = _nodes[0];
        const bottom: Node = _nodes[_nodes.length - 1];

        const incomers = getIncomers(top, nodes, edges);
        const outgoers = getOutgoers(bottom, nodes, edges);

        if (incomers.length === 0 && outgoers.length === 0)
            return;

        if (!draggedNodeRestore.current) {
            draggedNodeRestore.current = {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges))
            }
        }

        const filteredNodes = BrowserActions.map((a: any) => _nodes.some(n => n.data.action.id === a.id) ? null : a);
        const computedNesting = EvaluateNesting(filteredNodes);
        const newNodesEdges: TCreatedNodesAndEdges = actionsToFlowWithNullItems(computedNesting);
        const combinedNodes  = [...(newNodesEdges ? newNodesEdges.nodes : []), ..._nodes];

        const newEdges = [...(newNodesEdges ? newNodesEdges.edges : [])];
        const newNodes = combinedNodes.map((n, index) => {
            if (_nodes.some(_n => _n.id === n.id)) {
                n.data = { ...n.data, isDragging: true }
            }

            if (+n.id > +_nodes[_nodes.length - 1].id) {
                n.position.y = n.position.y - (_nodes.length * 50);
            }

            return n;
        });

        setNodes(newNodes);
        setEdges(newEdges);
    }, [])

    const onSelectionDragStop = useCallback((event: React.MouseEvent, _nodes: Node[]) => {
        if (!draggedNodeRestore.current)
            return;

        setNodes(draggedNodeRestore.current.nodes);
        setEdges(draggedNodeRestore.current.edges);
        draggedNodeRestore.current = null;
    },[draggedNodeRestore, setNodes, setEdges])

    const onNodeDragStart = useCallback((event: React.MouseEvent, node: Node) => {
        console.log("onNodeDragStart");
        const incomers = getIncomers(node, nodes, edges);
        const outgoers = getOutgoers(node, nodes, edges);

        if (incomers.length === 0 && outgoers.length === 0)
            return;

        if (!draggedNodeRestore.current) {
            draggedNodeRestore.current = {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges))
            }
        }

        const computedNesting = EvaluateNesting(
            BrowserActions.map((a: any) =>
                a.id === node.data.action.id
                    ? null
                    : a
            )); // change Dragged node to Null
        const newNodesEdges: TCreatedNodesAndEdges = actionsToFlowWithNullItems(computedNesting);
        let combNodes  = [...(newNodesEdges ? newNodesEdges.nodes : []), node];

        console.log("combNodes: ", JSON.parse(JSON.stringify(combNodes)));
        console.log("node: ", JSON.parse(JSON.stringify(node)));

        const newNodes = combNodes.map((n, index) => {
            if (n.id === node.id) {
                console.log("found Dragged Node");
                n.data = { ...n.data, isDragging: true }
            }

            if (+n.id > +node.id) {
                n.position.y = n.position.y - 50;
            }

            return n;
        });
        const newEdges = [...(newNodesEdges ? newNodesEdges.edges : [])];

        setNodes(newNodes);
        setEdges(newEdges);
    }, [draggedNodeRestore, getConnectedEdges, getIncomers, getOutgoers, setEdges, nodes, edges]);

    const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node, _nodes: Node[]) => {
        if (!draggedNodeRestore.current)
            return;

        setNodes(draggedNodeRestore.current.nodes);
        setEdges(draggedNodeRestore.current.edges);
        draggedNodeRestore.current = null;
    }, [draggedNodeRestore, setNodes, setEdges]);

    useEffect(() => {
        // console.log("useEffect Edges: ", edges);
    }, [edges])

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                // onInit={(instance)=>{}}
                nodes={nodes}
                edges={edges}

                onNodesChange={(changes: NodeChange[]) => {
                    setNodes(applyNodeChanges(changes, nodes));
                }}

                onEdgesChange={(changes: EdgeChange[]) => {
                    // console.log(`%c Edges Changed: ${changes}`);
                    setEdges(applyEdgeChanges(changes, edges));
                }}

                onNodeDragStart={onNodeDragStart}
                onNodeDragStop={onNodeDragStop}
                onSelectionDragStart={onSelectionDragStart}
                onSelectionDragStop={onSelectionDragStop}

                onConnect={onConnect}
                proOptions={proOptions}
                nodeTypes={nodeType}
                edgeTypes={edgeType}
                // snapToGrid
                fitView
            >
                <Controls />
                {/*<MiniMap />*/}
                <Panel position="top-left">bottom-left</Panel>
                <Background gap={12} size={1} />
                {/*<SelectionTest />*/}
            </ReactFlow>
        </div>
    );
}