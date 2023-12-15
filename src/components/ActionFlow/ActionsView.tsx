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
    ReactFlowProvider,
    useReactFlow
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

const BrowserActions: any = [
    {
        "id": "e3902519-f0a5-1cec-75d6-8675d0d44498",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "NewTab",
        "props": {
            "url": "https://chat.openai.com/c/79afec09-5608-4b68-87d9-b62e7169279b",
            "tabId": 1010962585,
            "windowId": 1010962533
        },
        "marginLeft": 0
    },
    {
        "id": "48f3027d-48ed-bf28-e024-8feb1d7c621f",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "div:nth-of-type(13) > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div > div > pre > div > div:nth-of-type(2)",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "const actionsToFlowWithNullItemsUseIndex = (actions: any, startIndex: number = 0) => {\n    // Create an array with null items until the starting index\n    const nullItems = Array(startIndex).fill(null);\n\n    // Concatenate the null items array with the original actions array\n    const actionsWithNullItems = nullItems.concat(actions);\n\n    let indexBeforeNull: number | null = null;\n\n    const nodes: any = actionsWithNullItems.map((a, index) => {\n        // ... (existing code)\n\n        if (!a) {\n            if (index > startIndex && actionsWithNullItems[index - 1]) {\n                indexBeforeNull = index - 1;\n            }\n            return null;\n        }\n\n        if (index > startIndex) {\n            const prevIndex = indexBeforeNull !== null ? indexBeforeNull : index - 1;\n\n            // ... (existing code)\n        }\n\n        // ... (existing code)\n\n        return {\n            type: \"actionNode\",\n            ...node_template(\n                String(index),\n                data,\n                node_x,\n                node_y,\n            )\n        } satisfies Node;\n    });\n\n    // ... (existing code)\n\n    return { nodes: nodes.filter((n: any) => n), edges };\n};\n\n// Example usage:\nconst actionsArray = [\n    // ... (your actions)\n];\n\nconst startIndex = 21;\nconst result = actionsToFlowWithNullItemsUseIndex(actionsArray, startIndex);"
        },
        "marginLeft": 0
    },
    {
        "id": "d48fd929-b5e6-a87e-00e3-d70161fba931",
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
        "id": "8f6e44c5-aeff-e07e-7d51-e3820c49ed54",
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
        "id": "bd12ea63-fb35-3fcd-46d1-d138ab29fe6b",
        "actionType": "Prompts",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Response Type": {
                "Accept": false,
                "Decline": false
            },
            "Response Text": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "13219d34-2f77-8682-030b-8da418a60e33",
        "actionType": "Select",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Selected": "",
            "Options": [
                ""
            ],
            "Description": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "28288281-2f24-f1b5-fcb8-20c45400c661",
        "actionType": "IF",
        "nestingLevel": 1,
        "conditions": [
            {
                "selectedVariable": "",
                "selectedType": "Element",
                "selectedOption": "IsVisible",
                "requiresCheck": true,
                "checkValue": ""
            }
        ],
        "marginLeft": 20
    },
    {
        "id": "7ff8cb06-0a6b-6d80-69bf-38244bbf41da",
        "actionType": "Prompts",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Response Type": {
                "Accept": false,
                "Decline": false
            },
            "Response Text": ""
        },
        "nestingLevel": 2,
        "marginLeft": 40
    },
    {
        "id": "796fcfcc-b718-49db-17a7-825053348150",
        "actionType": "Click",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": ""
        },
        "nestingLevel": 2,
        "marginLeft": 40
    },
    {
        "id": "b2bfde95-5324-70be-311c-d66bc070cd38",
        "actionType": "Date",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Date": ""
        },
        "nestingLevel": 2,
        "marginLeft": 40
    },
    {
        "id": "12bdd13b-deef-a34e-565a-4b8211a2a971",
        "actionType": "END",
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "0d91e917-7d46-16a9-41f1-1b39b9083b78",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "99e638f2-f899-bda7-6f58-9a5a56800717",
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
        "id": "fec141ac-6b92-2585-2971-b1934cecd2ff",
        "actionType": "Prompts",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Response Type": {
                "Accept": false,
                "Decline": false
            },
            "Response Text": ""
        },
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "a75c27e3-a039-17b3-5ec0-07b57b04c3fc",
        "actionType": "Select",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Selected": "",
            "Options": [
                ""
            ],
            "Description": ""
        },
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "812387e7-499f-9a4f-6255-dcd6f821a2c0",
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
        "id": "98776231-0881-72c0-a836-96253dee4c1d",
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
        "id": "534afae7-2293-235b-d0d2-38256405054a",
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
        "id": "cf8c84d6-e054-5968-bf7d-beac497baffd",
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
        "id": "f3ee1db4-3878-1b5e-ba5b-3d6709f00c07",
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
        "id": "00e6fb01-1768-22c5-51d0-9e1bc55713db",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    }
]

export type TNodeData = {
    isDragging: boolean;
    isDragSelect: boolean;
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
    let targetActionId: number | null = null;

    let ifNestingLevel: number | null = null;
    actions.forEach((curr_action, index) => {
        if (targetActionId || !curr_action)
            return;

        if (curr_action.id === id) {
            ifNestingLevel = curr_action.nestingLevel;
            return;
        }

        if (curr_action.actionType === "END" && curr_action.nestingLevel === ifNestingLevel) {
            targetActionId = index;
            return;
        }
    });

    return targetActionId;
};

type TCreatedNodesAndEdges = { nodes: Node[]; edges: Edge[]; } | null;

const actionsToFlowWithNullItems = (actions: any): TCreatedNodesAndEdges => {
    let nullCount = 0;

    if (!Array.isArray(actions) || actions.length === 0) {
        console.warn("[warning] fn actionsToFlow: passed bad argument - (actions: TAction[])");
        return null;
    }

    const v_dist = 100;
    const h_dist = 200;

    let edges: Edge[] = [];
    let indexBeforeNull: number | null = null;

    const nodes: any = actions.map((a, index) => {
        if (!a) {
            
            nullCount++;

            if (actions[index - 1]) {
                indexBeforeNull = index - 1;
            }
            return null;
        }

        if (index > 0) {
            const prevIndex = actions[index - 1] ? index - 1 : indexBeforeNull;
            if (prevIndex !== null) {
                const prevAction = actions[prevIndex];
                const prevActionType = prevAction.actionType;
                const edgeId = `e${prevIndex}-${index}`;

                // Adding an extra edge for special actions
                if (["IF"].includes(prevActionType) && actions[index + 1]?.actionType !== "END") {
                    const redEdgeTargetId = nextOfEndActionTargetId(prevAction.id, actions);
                    if (redEdgeTargetId !== null) {
                        edges.push(edge_template(
                            `e${prevIndex}-${redEdgeTargetId}`, //id
                            { offset: (redEdgeTargetId - prevIndex) * 100, isRedEdge: true }, //data
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
                        { offset: null, isRedEdge: false }, // data
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
        const node_y = Math.abs(index * v_dist - (nullCount * 100));
        const data = {
            isDragging: false,
            index,
            isDragSelect: false,
            action: a,
            current: null,
            hideTopHandle: index === 0 || index === 1 && !actions[index - 1] ? true : false,
            dispatch: null
        };

        // nullCount = 0;

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

function ActionsView(): JSX.Element | null {
    const n_e = useMemo(() => actionsToFlowWithNullItems(EvaluateNesting(BrowserActions)), []);
    const [nodes, setNodes, onNodesChange] = useNodesState(n_e ? n_e.nodes : []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(n_e ? n_e.edges : []);
    const draggedNodeRestore = useRef<{ nodes: Node[]; edges: Edge[]; } | null>();
    const { getIntersectingNodes } = useReactFlow();
    const intersectedIdRef = useRef<string>();

    const onConnect = useCallback(
        (params: any) => 
            setEdges((eds: Edge[]) => addEdge({
                ...params,
                animated: true,
                type: 'smoothstep'
            }, eds)),
        [setEdges]);

    const onSelectionDragStart = useCallback((event: React.MouseEvent, selectedNodes: Node[]) => {
        if (!draggedNodeRestore.current) {
            draggedNodeRestore.current = {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges))
            }
        }

        let nonSelectedNodes = nodes.map((node: any) => selectedNodes.some(selectedNode => selectedNode.data.action.id === node.data.action.id) ? null : node);
        nonSelectedNodes = EvaluateNesting(nonSelectedNodes.map(fln => fln?.data?.action));
        const newNonSelectedNodesEdges: TCreatedNodesAndEdges = actionsToFlowWithNullItems(nonSelectedNodes);

        if(!newNonSelectedNodesEdges)
            return;

        const start_y_dist = selectedNodes[0].position.y;
        const updatedSelectedNodes = selectedNodes.map((n, index) => {
            const new_y_dist = (index === 0) ? start_y_dist : (start_y_dist + 100);
            n.position.y = new_y_dist
            n.positionAbsolute.y = new_y_dist;
            n.data = { ...n.data, isDragSelect: true };
            return n;
        });
        setNodes([...newNonSelectedNodesEdges.nodes, ...updatedSelectedNodes]);

        let selectedEdges = edges.filter(e =>
            selectedNodes.some(n => n.id === e.source)
                &&
            selectedNodes.some(n => n.id === e.target)
        );
        setEdges([...newNonSelectedNodesEdges.edges, ...selectedEdges]);
    }, [setNodes, setEdges, nodes, edges]);

    const onSelectionDragStop = useCallback((event: React.MouseEvent, _nodes: Node[]) => {
        if (!draggedNodeRestore.current)
            return;

        setNodes(draggedNodeRestore.current.nodes);
        setEdges(draggedNodeRestore.current.edges);
        draggedNodeRestore.current = null;
    }, [draggedNodeRestore, setNodes, setEdges]);

    const onSelectionDrag = useCallback((event: React.MouseEvent, _nodes: Node[]) => {
        const top: Node = _nodes[0];
        const intersectedNode = nodes.find(n => 
            n.id !== top.id
            &&
            n.position.y <= top.position.y
            &&
            n.position.y >= top.position.y - 142
        );

        if (!intersectedNode)
            return;

        const intr_node_id = intersectedNode.id;
        const newEdgeId = `e${intr_node_id}-${top.id}`;

        const filteredEdges = edges.filter(e => e.target !== top.id);

        if (!edges.some(e => e.id === newEdgeId)) {
            const newEdge: Edge = edge_template(
                newEdgeId,
                { offset: null, isRedEdge: false },
                intr_node_id,
                String(top.id),
                intersectedNode.data.action.id,
                "actionEdge",
                intr_node_id,
                { stroke: "#00BFFF", strokeWidth: 2 },
                true
            );
            setEdges([...filteredEdges, newEdge]);
        }
    }, [setNodes, setEdges, edges, nodes]);

    const onNodeDrag = useCallback((event: React.MouseEvent, _node: Node, _nodes: Node[]) => {
        const intersectedNode = nodes.find(n => 
            n.id !== _node.id
                &&
            n.position.y <= _node.position.y
                &&
            n.position.y >= _node.position.y - 142
        );

        if (!intersectedNode)
            return;

        const intr_node_id = intersectedNode.id;
        const newEdgeId = `e${intr_node_id}-${_node.id}`;

        const filteredEdges = edges.filter(e => e.target !== _node.id);

        if (!edges.some(e => e.id === newEdgeId)) {
            const newEdge: Edge = edge_template(
                newEdgeId,
                { offset: null, isRedEdge: false },
                intr_node_id,
                String(_node.id),
                intersectedNode.data.action.id,
                "actionEdge",
                intr_node_id,
                { stroke: "#00BFFF", strokeWidth: 2 },
                true
            );

            setEdges([...filteredEdges, newEdge]);
        }
    }, [setNodes, setEdges, edges, nodes]);

    const onNodeDragStart = useCallback((event: React.MouseEvent, draggedNode: Node) => {
        if (!draggedNodeRestore.current) {
            draggedNodeRestore.current = {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges))
            }
        }

        let nonSelectedNodes = nodes.map((node: any) => node.data.action.id === draggedNode.data.action.id ? null : node);
        nonSelectedNodes = EvaluateNesting(nonSelectedNodes.map(fln => fln?.data?.action));

        const newNodesEdges: TCreatedNodesAndEdges = actionsToFlowWithNullItems(nonSelectedNodes);
        let combinedNodes = [...(newNodesEdges ? newNodesEdges.nodes : []), draggedNode];

        combinedNodes = combinedNodes.map((n, index) => {
            if (n.id === draggedNode.id) {
                n.data = { ...n.data, isDragging: true, hideTopHandle: false }
            }

            return n;
        });
        setNodes(combinedNodes);

        const combinedEdges = [...(newNodesEdges ? newNodesEdges.edges : [])];
        setEdges(combinedEdges);
    }, [draggedNodeRestore, getConnectedEdges, getIncomers, getOutgoers, setEdges, nodes, edges]);

    const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node, _nodes: Node[]) => {
        if (!draggedNodeRestore.current)
            return;

        setNodes(draggedNodeRestore.current.nodes);
        setEdges(draggedNodeRestore.current.edges);
        draggedNodeRestore.current = null;
    }, [draggedNodeRestore, setNodes, setEdges]);

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
                    setEdges(applyEdgeChanges(changes, edges));
                }}

                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onSelectionDragStart={onSelectionDragStart}
                onSelectionDrag={onSelectionDrag}
                onSelectionDragStop={onSelectionDragStop}
                // onSelectionChange={({ nodes, edges } : { nodes: Node[]; edges: Edge[]; }) => console.log("onSelectionChange, Nodes: ", nodes, ", Edges: ", edges)}

                onConnect={onConnect}
                proOptions={proOptions}
                nodeTypes={nodeType}
                edgeTypes={edgeType}
                // snapToGrid
                elevateEdgesOnSelect={true}
                fitView
            >
                <Controls />
                {/*<MiniMap />*/}
                <Panel position="bottom-right">bottom-left</Panel>
                <Background gap={12} size={1} />

                {/*<SelectionTest />*/}
            </ReactFlow>
        </div>
    );
}

export default function Main() {
    return (
        <ReactFlowProvider>
            <ActionsView />
        </ReactFlowProvider>
    );
}