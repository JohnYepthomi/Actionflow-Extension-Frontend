import { Stage, Layer, Text, Rect } from "react-konva";
import KonvaActions from "./KonvaActions";
import React from "react";
import type { Stage as TStage } from "konva/lib/Stage";
import type { Layer as TLayer } from "konva/lib/Layer";
import { Shape } from "konva/lib/Shape";
import { Tween } from "konva/lib/Tween";
import { getActionXPos, getActionYPos, updateDashLine } from "./KonvaActions";

const testActions = [
  { id: 0, actionType: "IF", nestingLevel: 0 },
  { id: 1, actionType: "Click", nestingLevel: 1 },
  { id: 2, actionType: "Type", nestingLevel: 1 },
  { id: 3, actionType: "Select", nestingLevel: 1 },
  { id: 4, actionType: "Keypress", nestingLevel: 1 },
  { id: 5, actionType: "Upload", nestingLevel: 1 },
];

const GLOBAL_EASING = window.Konva.Easings.BackEaseOut;
const GLOBAL_DUR = 0.2;

export default function KonvaStage({ flowActions }) {
  const prevMoveNode = React.useRef<Shape>();
  const stageRef = React.useRef<TStage>();
  const draggedNodeRef = React.useRef<Shape>();
  const mainLayerRef = React.useRef<TLayer>();
  const [prevLinePoints, setPrevLinePoints] = React.useState<number[]>([
    20, // x1 0
    0, // y1 1
    10, // x2 2
    0, // y2 3
    10, // x3 4
    200, // y3 5
    20, // x4 6
    200, // y4 7
  ]);
  const prevLevelRef = React.useRef();

  function handleStageDragStart(e) {
    if (stageRef.current) {
      const tempLayer = stageRef.current.findOne("#temp-layer");
      e.target.parent.moveTo(tempLayer);
      draggedNodeRef.current = e.target;
    }
  }
  function handleStageDragMove(evt) {
    if (!stageRef.current || !mainLayerRef.current) return;

    const pos = stageRef.current.getPointerPosition();
    const currNode = mainLayerRef.current.getIntersection(pos);

    // fires events
    if (prevMoveNode.current && currNode) {
      if (prevMoveNode.current !== currNode) {
        // leave from old targer
        prevMoveNode.current.fire(
          "dragleave",
          {
            evt: evt.evt,
          },
          true
        );

        // enter new targer
        currNode.fire(
          "dragenter",
          {
            evt: evt.evt,
          },
          true
        );
        prevMoveNode.current = currNode;
      } else {
        prevMoveNode.current.fire(
          "dragover",
          {
            evt: evt.evt,
          },
          true
        );
      }
    } else if (!prevMoveNode.current && currNode) {
      prevMoveNode.current = currNode;
      currNode.fire(
        "dragenter",
        {
          evt: evt.evt,
        },
        true
      );
    } else if (prevMoveNode.current && !currNode) {
      prevMoveNode.current.fire(
        "dragleave",
        {
          evt: evt.evt,
        },
        true
      );
      prevMoveNode.current = undefined;
    }
  }
  function handleDragEnter(e) {
    const dropNode: Shape = e.target;
    dropNode.opacity(0.5);

    const dragIndex = draggedNodeRef.current.getAttr("action-index");
    const dropIndex = dropNode.getAttr("action-index");
    if (
      Math.abs(dropIndex - dragIndex) != 1 ||
      draggedNodeRef.current === dropNode
    ) {
      return;
    }
    // dropNode.fill("yellow");
    const dragActionType = draggedNodeRef.current.getAttr("action-type");
    let dragLevel = draggedNodeRef.current.getAttr("action-level");
    const dropLevel = dropNode.getAttr("action-level");
    if (dragActionType === "IF" && dragLevel === dropLevel) {
      dragLevel++;
    }

    if (dragActionType != "IF" && dragActionType != "END") {
      draggedNodeRef.current.setAttr(
        "action-level",
        dropNode.getAttr("action-level")
      );
    }
    draggedNodeRef.current.setAttr(
      "action-index",
      dropNode.getAttr("action-index")
    );

    // 'dropNode' inherits 'draggedNode' attributes
    const swapX = getActionXPos(dragLevel);
    const swapY = getActionYPos(dragIndex);
    const dropTween = new Tween({
      node: dropNode,
      duration: GLOBAL_DUR,
      x: swapX,
      y: swapY,
      easing: GLOBAL_EASING,
      onFinish: () => dropTween.destroy(),
    }).play();
    dropNode.setAttr("action-level", dragLevel);
    dropNode.setAttr("action-index", dragIndex);

    const textNode = dropNode.parent.findOne("#text-node");
    const dropTextTween = new Tween({
      node: textNode,
      duration: GLOBAL_DUR,
      x: swapX + 30,
      y: swapY + 4,
      easing: GLOBAL_EASING,
      onFinish: () => {
        dropTextTween.destroy();
        const actiontype = textNode.getAttr("action-type");
        textNode.setAttr(
          "text",
          `${actiontype}` //                -------------------- x: ${swapX}, y: ${swapY}`
        );
      },
    }).play();
  }
  function handleDragEnd(e) {
    const dragActionLevel = draggedNodeRef.current.getAttr("action-level");
    const dragActionIndex = draggedNodeRef.current.getAttr("action-index");
    const currDraggedX = getActionXPos(dragActionLevel);
    const currDraggedY = getActionYPos(dragActionIndex);

    const textNode = e.target.parent.findOne("#text-node");
    const tetxTween = new Tween({
      node: textNode,
      duration: GLOBAL_DUR,
      x: currDraggedX + 30,
      y: currDraggedY + 4,
      easing: GLOBAL_EASING,
      onFinish: () => {
        tetxTween.destroy();
        const actiontype = textNode.getAttr("action-type");
        textNode.setAttr(
          "text",
          `${actiontype}` //                -------------------- x: ${currDraggedX}, y: ${currDraggedY}`
        );
      },
    }).play();

    e.target.parent.moveTo(mainLayerRef.current);
    const rectTween = new Tween({
      node: e.target,
      duration: GLOBAL_DUR,
      x: currDraggedX,
      y: currDraggedY,
      easing: GLOBAL_EASING,
      onFinish: () => rectTween.destroy(),
    }).play();

    updateDashLine(e.target, setPrevLinePoints, {
      x: currDraggedX,
      y: currDraggedY,
    });

    draggedNodeRef.current = null;
  }
  function handleDragLeave(e) {
    // e.target = moved/swaped node
    // reverting fill to initial color
    // if (draggedNodeRef.current != e.target) e.target.fill("purple");
  }

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onDragStart={handleStageDragStart}
      onDragMove={handleStageDragMove}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <Layer id="temp-layer"></Layer>

      <Layer ref={mainLayerRef}>
        {testActions &&
          testActions.map((action, index) => {
            return (
              <KonvaActions
                action={action}
                itemIndex={index}
                prevLinePoints={prevLinePoints}
                setPrevLinePoints={setPrevLinePoints}
              />
            );
          })}
      </Layer>

      <Layer>
        <Rect
          x={0}
          y={0}
          width={100}
          height={20}
          fill={"rgba(48, 43, 45, 0.8)"}
          opacity={0}
          id="shadow-node"
          listening={false}
        />
      </Layer>
    </Stage>
  );
}
