import React from "react";
import { Group, Line, Rect, Text } from "react-konva";
import Konva from "konva";
import { Animation } from "konva/lib/Animation";
import { Shape } from "konva/lib/Shape";

type ITEM_GAP = 30;
type MARGIN_LEFT = 70;
export type LEVEL = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type LINE_EXTRA = 5;

export function getActionXPos(
  level: LEVEL,
  isLine: boolean = false,
  initial: MARGIN_LEFT = 70,
  gap: ITEM_GAP = 30
) {
  if (isLine) initial = (initial - 25) as any;

  if (level === 0) return initial;
  else if (level === 1) return initial + gap;
  else return level * gap + initial;
}

export function getActionYPos(action_idx: number, isLine: boolean = false) {
  const gap: ITEM_GAP = 30;
  const extra: LINE_EXTRA = 5;

  // if (action_idx === null || action_idx === undefined) return;

  if (isLine) return action_idx * gap + 50 + extra;
  else return action_idx * gap + 50;
}

type ItemState = {
  isDragging: boolean;
  x: number;
  y: number;
};

declare global {
  interface Window {
    Konva: typeof Konva;
  }
}

export function updateDashLine(
  Rect: Shape,
  setter: React.Dispatch<React.SetStateAction<number[]>>,
  lineUpdatePos?: { x: number; y: number }
) {
  const line = Rect.parent.findOne(".dashed-line") as any;
  if (line) {
    const points: number[] = line.points().slice();
    const lineIndex: number = line.getAttr("action-index");
    const lineLevel: number = line.getAttr("action-level");
    const YPOS = getActionYPos(lineIndex);
    const XPOS = getActionXPos(lineLevel as LEVEL);

    points[1] = lineUpdatePos ? lineUpdatePos.y - YPOS : Rect.y() - YPOS;
    points[3] = lineUpdatePos ? lineUpdatePos.y - YPOS : Rect.y() - YPOS;
    points[0] = lineUpdatePos
      ? lineUpdatePos.x - XPOS + 20
      : Rect.x() + 20 - XPOS;

    setter([
      points[0],
      points[1],
      points[2],
      points[3],
      points[4],
      points[5],
      points[6],
      points[7],
    ]);
  }
}

export default function KonvaActions({
  action,
  itemIndex,
  prevLinePoints,
  setPrevLinePoints,
}) {
  const nestingLevel: LEVEL = action.nestingLevel;
  const [state, setState] = React.useState<ItemState>({
    isDragging: false,
    x: getActionXPos(nestingLevel),
    y: getActionYPos(itemIndex, false),
  });
  const [dashOffset, setDashOffset] = React.useState<number>(0);
  const animRef = React.useRef<Animation>();
  const wall = React.useRef();

  React.useEffect(() => {
    return () => {
      if (animRef.current) animRef.current?.stop();
    };
  }, []);

  function handleRectMove(e) {
    const Rect = e.target;
    const level = e.target.getAttr("action-level");
    const index: number = e.target.getAttr("action-index");

    if (getActionXPos(level) >= e.target.x()) Rect.x(getActionXPos(level));

    setState({ ...state, x: Rect.x(), y: Rect.y() });
    updateDashLine(Rect, setPrevLinePoints);
  }

  const startAnimation = () => {
    if (window.Konva) {
      animRef.current = new window.Konva.Animation((frame) => {
        const timeDiffFactor = frame.timeDiff * 0.005;
        setDashOffset((dashOffset) => (dashOffset + timeDiffFactor) % 17);
      });

      if (animRef.current) animRef.current.start();
    }
  };

  const isIF = action.actionType === "IF";
  const isEND = action.actionType === "END";

  return (
    <Group action-level={action.nestingLevel}>
      {action.actionType === "IF" && (
        <Line
          x={getActionXPos(nestingLevel, true)}
          y={getActionYPos(itemIndex, true)}
          points={prevLinePoints}
          stroke={"rgb(59, 54, 54)"}
          lineCap="round"
          lineJoin="round"
          strokeWidth={1}
          name="dashed-line"
          dash={[dashOffset, 5]}
          action-index={itemIndex}
          action-level={nestingLevel}
        />
      )}

      <Rect
        x={state.x}
        y={state.y}
        width={100}
        height={20}
        fill={isIF ? "purple" : isEND ? "skyblue" : "chocolate"}
        stroke={"white"}
        strokeWidth={0.5}
        draggable
        action-type={action.actionType}
        action-level={action.nestingLevel}
        action-index={itemIndex}
        id={JSON.stringify(itemIndex)}
        onDragStart={(e) => {
          setState({
            ...state,
            isDragging: true,
          });

          e.target.parent.findOne<Shape>(".dashed-line")?.stroke("pink");
          // Start Line Animation
          startAnimation();
        }}
        onDragEnd={(e) => {
          setState({
            isDragging: false,
            x: e.target.x(),
            y: e.target.y(),
          });

          // End Line Animation
          if (animRef.current) {
            animRef.current.stop();
            setDashOffset(0);
          }

          e.target.parent
            .findOne<Shape>(".dashed-line")
            ?.stroke("rgb(59, 54, 54)");
        }}
        onDragMove={handleRectMove}
        name={action?.actionType}
        opacity={0.5}
        outerRadius={10}
      />
      <Text
        action-type={action.actionType}
        text={
          action?.actionType
          // +
          // "                -------------------- x: " +
          // state.x +
          // ", y: " +
          // state.y
        }
        x={state.x + 30}
        y={state.y + 4}
        fontSize={13}
        fill={
          state.isDragging
            ? "red"
            : ["IF", "END"].includes(action.actionType)
            ? "pink"
            : "beige"
        }
        id="text-node"
        listening={false}
      />
    </Group>
  );
}
