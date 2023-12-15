import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useNodesInitialized } from 'reactflow';
import { motion } from 'framer-motion';
import "./edge.css";

const onEdgeClick = (evt: React.MouseEvent, id: string) => {
  evt.stopPropagation();
  alert(`remove ${id}`);
};

const options = {
  includeHiddenNodes: false,
};

export default function ActionEdge({
  id,
  label,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerStart,
  animated,
  markerEnd,
}: EdgeProps) {
  const { offset, isRedEdge} = data;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const red_edge_style_override = {
    ...style,
    strokeDasharray: offset ?? 1000, // get the path length using js, probably give it a unique id 
    strokeDashoffset: offset ?? 1000,
    animationDelay: "1s",
    animation: offset ? `lindraw ${offset * 0.0003}s linear forwards` : "lindraw 2s linear forwards"
  }

  return (
    <>
      {/*<defs style={{}}>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon fill="white" points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>*/}

      <BaseEdge
        path={edgePath}
        // markerStart='arrow'
        // markerEnd={"url(#arrowhead)"}
        style={animated ? style : red_edge_style_override}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/*sourceY: {sourceY}*/}
          {/*<button className="edgebutton" onClick={(event) => onEdgeClick(event, id)}>
            ×
          </button>*/}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
