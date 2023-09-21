import {
  TAction,
  THeaderInfoActions,
} from "../../Schemas/replaceTypes/Actions";
import type { AnimationControls } from "framer-motion";
import { InteractionDefinitions } from "../../ActionsDefinitions/definitions";
import React from "react";

function HeaderInfo<T extends THeaderInfoActions>({ action }: { action: T }) {
  if (
    action.actionType === "Text" ||
    action.actionType === "Anchor" ||
    action.actionType === "Attribute" ||
    action.actionType === "URL"
  )
    return (
      <div
        style={{
          pointerEvents: "none",
          width: 300 - action.nestingLevel * 15,
          textOverflow: "ellipsis",
          height: "fit-content",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          color: "orange",
        }}
      >
        {action.props.value}
      </div>
    );
  else if (
    action.actionType === "Click" ||
    (action.actionType == "Select" && action.props.Description !== "")
  )
    return (
      <div
        style={{
          pointerEvents: "none",
          width: 300 - action.nestingLevel * 15,
          textOverflow: "ellipsis",
          height: "fit-content",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          color: "orange",
        }}
      >
        {action.props.Description}
      </div>
    );
  else if (action.actionType === "Type" && action.props.Text !== "") {
    return (
      <div
        style={{
          pointerEvents: "none",
          width: 300 - action.nestingLevel * 15,
          textOverflow: "ellipsis",
          height: "fit-content",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          color: "orange",
        }}
      >
        {action.props.Text}
      </div>
    );
  } else if (
    ["NewTab", "SelectTab", "SelectWindow", "CloseTab", "Navigate"].includes(
      action.actionType
    ) &&
    "url" in action.props &&
    action.props.url !== ""
  ) {
    return (
      <div
        style={{
          pointerEvents: "none",
          width: 300 - action.nestingLevel * 15,
          textOverflow: "ellipsis",
          height: "fit-content",
          whiteSpace: "nowrap",
          overflowX: "hidden",
          color: "orange",
        }}
      >
        {action.props.url}
      </div>
    );
  }

  return <></>;
}

function ActionHeader({
  action,
  animateControl,
}: {
  action: TAction;
  animateControl: AnimationControls;
}) {
  const handleAnimate = React.useCallback((control: any) => {
    control.set("hidden");
    control.start("visible");
  }, []);

  const handleHeaderClick = React.useCallback((e: any) => {
    const detailsEl = e.target.parentElement.querySelector(".action-details");

    if (detailsEl) {
      const attr_val = JSON.parse(detailsEl.getAttribute("data-show-details"));
      if (attr_val) detailsEl.setAttribute("data-show-details", "false");
      else detailsEl.setAttribute("data-show-details", "true");
    }
  }, []);

  const renderActionHeader = React.useCallback(() => {
    return (
      <div className="action-header gap-1" onClick={handleHeaderClick}>
        <div className="flex-row" style={{ pointerEvents: "none" }}>
          <div className="flex-row align-center justify-start gap-7 caption">
            <div className="flex-row align-center justify-center ms-5">
              {InteractionDefinitions.find((d) => d.name === action.actionType)?.svg()}
            </div>
            <div className="name">{action.actionType}</div>
            {"recorded" in action && action.recorded && (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-record2" viewBox="0 0 16 16">
                <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1A5 5 0 1 0 8 3a5 5 0 0 0 0 10z"/>
                <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
              </svg>)}
          </div>
          <HeaderInfo action={action}/>
        </div>
      </div>
    )
  },[])

  console.log("=====rendered===== ACTION HEADER COMPONENT actionType: ", action.actionType);

  return renderActionHeader();
}

export default ActionHeader;
