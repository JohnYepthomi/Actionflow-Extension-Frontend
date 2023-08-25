import Editor from "./Editor.jsx";
import React from "react";
import {
  IntAction,
  TClickAction,
  TTypeAction,
  TSelectAction,
  TKeypressAction,
  THoverAction,
  TCommonProp,
  TListAction,
} from "../Types/ActionTypes/Interaction Actions";
import { TAction } from "../Types/ActionTypes/Action";
import { TEvtWithProps } from "../Types/State Types/StateEvents.js";
import messageTab from "../utils/messageTab.js";

function debounce(fn, ms) {
  let timer;
  return function () {
    // console.log("timerId: ", timer);
    clearTimeout(timer);
    const context = this;
    const args = arguments;

    timer = setTimeout(function () {
      console.log("Interaction: DEBOUNCING DISPATCH ARGS: ", args);
      timer = null;
      fn.apply(context, args);
    }, ms);
  };
}

const DEBOUNCE_DELAY = 0;

type TCommonDispatchRef = (
  props: TCommonProp,
  dispatch: any,
  actionId: string
) => void;

function Common({ action, dispatch }) {
  const commomDispatchRef = React.useRef<TCommonDispatchRef>(
    debounce((selector, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Common",
        props: selector,
        actionId,
      } as TEvtWithProps);
    }, DEBOUNCE_DELAY)
  );

  const handlePickElement = React.useCallback((actionType: string) => {
    if (actionType === "List") {
      console.log("Picking List Element");
      messageTab({}); // <--------------------<< Message contentScript on the active tab to enable selecting list elements.
    }
  }, []);

  const handleSelectorChange = React.useCallback((e) => {
    commomDispatchRef.current(
      { ...action.props, selector: e.target.value },
      dispatch,
      action.id
    );
  }, []);

  return (
    <div className="common flex-column">
      <div className="fs-md">Selector</div>
      <div className="flex-row align-center">
        <input
          className="flex-1"
          type="text"
          placeholder="Css Selector"
          value={action.props.selector}
          onChange={handleSelectorChange}
        />
        <button
          className="button-60"
          onClick={() => handlePickElement(action.actionType)}
        >
          Pick
        </button>
      </div>
    </div>
  );
}

function Scroll({ action, current, dispatch }) {
  return (
    <div className="flex-column mt">
      <div className="fs-md">Scroll Direction</div>
      <select>
        <option>Scroll Top</option>
        <option>Scroll Bottom</option>
      </select>
      <div className="flex-column mt">
        <label className="fs-md">Description</label>
        <input type="text" placeholder="Enter description" />
      </div>
    </div>
  );
}

type TClickDispatchRef = (
  props: TClickAction["props"],
  dispatch: any,
  actionId: string
) => void;

function Click({ action, dispatch }: { action: TClickAction; dispatch: any }) {
  const dbounceRef = React.useRef<TClickDispatchRef>(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Click",
        props,
        actionId,
      } as TEvtWithProps);
    }, DEBOUNCE_DELAY)
  );

  const handleClickProps = React.useCallback((e) => {
    const prop = e.target.getAttribute("data-proptype");

    if (prop === "Wait For New Page To load") {
      dbounceRef.current(
        { ...action.props, "Wait For New Page To load": e.target.checked },
        dispatch,
        action.id
      );
    }
    if (prop === "Wait For File Download") {
      dbounceRef.current(
        { ...action.props, "Wait For File Download": e.target.checked },
        dispatch,
        action.id
      );
    }
    if (prop === "Description") {
      dbounceRef.current(
        { ...action.props, Description: e.target.value },
        dispatch,
        action.id
      );
    }
  }, []);

  return (
    <div className="flex-column mt">
      <div className="flex-row align-center fs-md">
        <input
          type="checkbox"
          defaultChecked={action.props["Wait for New Page to Load"]}
          data-proptype="Wait For New Page To load"
          onChange={handleClickProps}
        />
        Wait for New Page to Load
      </div>

      <div className="flex-row align-center fs-md">
        <input
          type="checkbox"
          defaultChecked={action.props["Wait for file Download"]}
          data-proptype="Wait For File Download"
          onChange={handleClickProps}
        />
        Wait for file Download
      </div>

      <div className="flex-column mt">
        <label className="fs-md">Description (optional)</label>
        <input
          type="text"
          placeholder="Enter description"
          value={action.props["Description"]}
          data-proptype="Description"
          onChange={handleClickProps}
        />
      </div>
    </div>
  );
}

type TTypeDispatchRef = (
  props: TTypeAction["props"],
  dispatch: any,
  actionId: string
) => void;

function Type({ action, dispatch }: { action: TTypeAction; dispatch: any }) {
  const dbounceRef = React.useRef<TTypeDispatchRef>(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Type",
        props,
        actionId,
      } as TEvtWithProps);
    }, DEBOUNCE_DELAY)
  );

  const handleTypePropChange = React.useCallback((e) => {
    if (e.target.getAttribute("data-proptype") === "typing-text") {
      dbounceRef.current(
        { ...action.props, Text: e.target.value },
        dispatch,
        action.id
      );
    }
    if (e.target.getAttribute("data-proptype") === "overwrite-text") {
      dbounceRef.current(
        { ...action.props, "Overwrite Existing Text": e.target.checked },
        dispatch,
        action.id
      );
    }
  }, []);

  return (
    <div className="flex-column mt">
      <div className="fs-md">Text</div>
      <input
        type="text"
        placeholder="Type Text"
        value={action.props["Text"]}
        data-proptype="typing-text"
        onChange={handleTypePropChange}
      />
      <div className="flex-row align-center fs-md">
        <input
          type="checkbox"
          checked={action.props["Overwrite Existing Text"]}
          data-proptype="overwrite-text"
          onChange={handleTypePropChange}
        />
        Overwrite Existing Text
      </div>
    </div>
  );
}

type THoverDispatchRef = (
  props: THoverAction["props"],
  dispatch: any,
  actionId: string
) => void;

function Hover({ action, dispatch }: { action: THoverAction; dispatch: any }) {
  const dbounceRef = React.useRef<THoverDispatchRef>(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Hover",
        props,
        actionId,
      } as TEvtWithProps);
    }, DEBOUNCE_DELAY)
  );

  const handlerDescriptionChange = React.useCallback((e) => {
    dbounceRef.current(
      { ...action.props, Description: e.target.value },
      dispatch,
      action.id
    );
  }, []);

  return (
    <div className="flex-column mt">
      <div className="flex-column">
        <label className="fs-md">Description (Optional)</label>
        <input
          type="text"
          placeholder="Enter description"
          value={action.props["Description"]}
          onChange={handlerDescriptionChange}
        />
      </div>
    </div>
  );
}

type TKeypressDispatchRef = (
  props: TKeypressAction["props"],
  dispatch: any,
  actionId: string
) => void;

function Keypress({
  action,
  dispatch,
}: {
  action: TKeypressAction;
  dispatch: any;
}) {
  const keypressDispatchRef = React.useRef<TKeypressDispatchRef>(
    debounce((keypressProps, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Keypress",
        props: keypressProps,
        actionId,
      } as TEvtWithProps);
    }, DEBOUNCE_DELAY)
  );

  function handleKeypressChange(e) {
    if (e.target.getAttribute("data-proptype") === "key") {
      keypressDispatchRef.current(
        { ...action.props, Key: e.target.value },
        dispatch,
        action.id
      );
    }
    if (e.target.getAttribute("data-proptype") === "wait-for-page-load") {
      keypressDispatchRef.current(
        { ...action.props, "Wait For Page To Load": e.target.checked },
        dispatch,
        action.id
      );
    }
  }

  return (
    <div className="flex-column mt">
      <div className="flex-column">
        <label className="fs-md">Key</label>
        <div className="flex-row align-center">
          <input
            type="text"
            value={action.props["Key"]}
            data-proptype="key"
            onChange={handleKeypressChange}
          />
          <button>Detect</button>
        </div>
      </div>
      <div className="flex-row align-center fs-md">
        <input
          type="checkbox"
          checked={action.props["Wait For Page To Load"]}
          data-proptype="wait-for-page-load"
          onChange={handleKeypressChange}
        />
        <div> Wait for new page to load</div>
      </div>
    </div>
  );
}

function Upload({ action, current, dispatch }) {
  return (
    <div className="flex-column mt">
      <label className="fs-md">Path</label>
      <input type="text" placeholder="eg. /documents/file/names.txt" />
    </div>
  );
}

type TSelectDispatchRef = (
  props: TSelectAction["props"],
  dispatch: any,
  actionId: string
) => void;

function Select({
  action,
  dispatch,
}: {
  action: TSelectAction;
  dispatch: any;
}) {
  const SelectDispatchRef = React.useRef<TSelectDispatchRef>(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Select",
        props,
        actionId,
      } as TEvtWithProps);
    }, DEBOUNCE_DELAY)
  );

  const handleSelectChange = React.useCallback((e) => {
    if (e.target.getAttribute("data-proptype") === "select-value") {
      SelectDispatchRef.current(
        { ...action.props, Selected: e.target.value },
        dispatch,
        action.id
      );
    }
    if (e.target.getAttribute("data-proptype") === "select-description") {
      SelectDispatchRef.current(
        { ...action.props, Description: e.target.value },
        dispatch,
        action.id
      );
    }
  }, []);

  return (
    <div className="flex-column mt">
      <div className="flex-column">
        <label className="fs-md">Value</label>
        {/* <input type="text" value={selectProps["Value"]} data-proptype="select-value" onChange={handleSelectChange} /> */}
        <select>
          {action.props?.Options?.map((option, index) => {
            return (
              <option key={index} selected={option === action.props.Selected}>
                {" "}
                {option}{" "}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex-column">
        <label className="fs-md">Description</label>
        <input
          type="text"
          value={action.props.Description}
          data-proptype="select-description"
          onChange={handleSelectChange}
        />
      </div>
    </div>
  );
}

function Date({ action, current, dispatch }) {
  return (
    <div className="flex-column mt">
      <label className="fs-md">Date</label>
      <input type="text" />
    </div>
  );
}

function Prompts({ action, current, dispatch }) {
  return (
    <div className="flex-column mt">
      <label className="fs-md">Response Type</label>
      <select>
        <option>Accept</option>
        <option>Decline</option>
      </select>
      <div className="flex-column mt txt-clr fs-md">
        <div>Response Text (Optional)</div>
        <input type="text" />
      </div>
    </div>
  );
}

function Code({
  action,
  actions,
  dispatch,
}: {
  action: IntAction;
  actions: TAction[];
  dispatch: any;
}) {
  return (
    <Editor
      actions={actions}
      actionId={action.id}
      actionProps={action.props}
      dispatch={dispatch}
    />
  );
}

function List({ action, dispatch }) {
  return <></>;
}

export default function Interaction({
  action,
  actions,
  current,
  dispatch,
}: {
  action: IntAction;
  actions: TAction[];
  current: any;
  dispatch: any;
}) {
  const actionName = action.actionType;

  return (
    <>
      {actionName != "Prompts" && actionName != "Code" && (
        <Common action={action} dispatch={dispatch} />
      )}
      {actionName === "Code" && (
        <Code action={action} actions={actions} dispatch={dispatch} />
      )}
      {actionName === "Type" && <Type action={action} dispatch={dispatch} />}
      {actionName === "Date" && (
        <Date action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Click" && <Click action={action} dispatch={dispatch} />}
      {actionName === "Hover" && <Hover action={action} dispatch={dispatch} />}
      {actionName === "Scroll" && (
        <Scroll action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Upload" && (
        <Upload action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Select" && (
        <Select action={action} dispatch={dispatch} />
      )}
      {actionName === "Prompts" && (
        <Prompts action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Keypress" && (
        <Keypress action={action as TKeypressAction} dispatch={dispatch} />
      )}

      {actionName === "List" && (
        <List action={action as TListAction} dispatch={dispatch} />
      )}
    </>
  );
}
