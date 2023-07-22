import Editor from "./Editor.jsx";
import React from "react";
import {
  IntAction,
  TAction,
  TClickAction,
  TTypeAction,
  TSelectAction,
  TKeypressAction,
  THoverAction,
  TCommonProp,
} from "../AppState/types";

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

type TCommonDispatchRef = {
  current: (props: TCommonProp, dispatch: any, actionId: string) => void;
};
function Common({ action, current, dispatch }) {
  const commomDispatchRef: TCommonDispatchRef = React.useRef(
    debounce((selector, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Common",
        props: selector,
        actionId,
      });
    }, DEBOUNCE_DELAY)
  );

  function handleSelectorChange(e) {
    commomDispatchRef.current(
      { ...action.props, selector: e.target.value },
      dispatch,
      action.id
    );
  }

  return (
    <div className="common flex-column">
      <div className="fw-bold txt-clr fs-md">Selector</div>
      <div className="flex-row align-center">
        <input
          className="flex-1"
          type="text"
          placeholder="Css Selector"
          value={action.props.selector}
          onChange={handleSelectorChange}
        />
        <button className="button-60">Pick</button>
      </div>
    </div>
  );
}

function Scroll({ action, current, dispatch }) {
  return (
    <div className="flex-column mt">
      <div className="fw-bold txt-clr fs-md">Scroll Direction</div>
      <select>
        <option>Scroll Top</option>
        <option>Scroll Bottom</option>
      </select>
      <div className="flex-column mt">
        <label className="fw-bold txt-clr fs-md">Description</label>
        <input type="text" placeholder="Enter description" />
      </div>
    </div>
  );
}

type TClickDispatchRef = {
  current: (
    props: TClickAction["props"],
    dispatch: any,
    actionId: string
  ) => void;
};

function Click({
  action,
  current,
  dispatch,
}: {
  action: TClickAction;
  current: any;
  dispatch: any;
}) {
  const dbounceRef: TClickDispatchRef = React.useRef(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Click",
        props,
        actionId,
      });
    }, DEBOUNCE_DELAY)
  );

  function handleClickProps(e) {
    const intPropType = e.target.getAttribute("data-proptype");

    if (intPropType === "Wait For New Page To load") {
      dbounceRef.current(
        { ...action.props, "Wait For New Page To load": e.target.checked },
        dispatch,
        action.id
      );
    }
    if (intPropType === "Wait For File Download") {
      dbounceRef.current(
        { ...action.props, "Wait For File Download": e.target.checked },
        dispatch,
        action.id
      );
    }
    if (intPropType === "Description") {
      dbounceRef.current(
        { ...action.props, Description: e.target.value },
        dispatch,
        action.id
      );
    }
  }

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
        <label className="fw-bold txt-clr fs-md">Description (optional)</label>
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

type TTypeDispatchRef = {
  current: (
    props: TTypeAction["props"],
    dispatch: any,
    actionId: string
  ) => void;
};
function Type({
  action,
  current,
  dispatch,
}: {
  action: TTypeAction;
  current: any;
  dispatch: any;
}) {
  const dbounceRef: TTypeDispatchRef = React.useRef(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Type",
        props,
        actionId,
      });
    }, DEBOUNCE_DELAY)
  );

  function handleTypePropChange(e) {
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
  }

  return (
    <div className="flex-column mt">
      <div className="fw-bold txt-clr fs-md">Text</div>
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

type THoverDispatchRef = {
  current: (
    props: THoverAction["props"],
    dispatch: any,
    actionId: string
  ) => void;
};
function Hover({
  action,
  current,
  dispatch,
}: {
  action: THoverAction;
  current: any;
  dispatch: any;
}) {
  const dbounceRef: THoverDispatchRef = React.useRef(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Hover",
        props,
        actionId,
      });
    }, DEBOUNCE_DELAY)
  );

  function handlerDescriptionChange(e) {
    dbounceRef.current(
      { ...action.props, Description: e.target.value },
      dispatch,
      action.id
    );
  }

  return (
    <div className="flex-column mt">
      <div className="flex-column">
        <label className="fw-bold txt-clr fs-md">Description (Optional)</label>
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

type TKeypressDispatchRef = {
  current: (
    props: TKeypressAction["props"],
    dispatch: any,
    actionId: string
  ) => void;
};
function Keypress({
  action,
  current,
  dispatch,
}: {
  action: TKeypressAction;
  current: any;
  dispatch: any;
}) {
  const keypressDispatchRef: TKeypressDispatchRef = React.useRef(
    debounce((keypressProps, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Keypress",
        props: keypressProps,
        actionId,
      });
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
        <label className="fw-bold txt-clr fs-md">Key</label>
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
      <label className="fw-bold txt-clr fs-md">Path</label>
      <input type="text" placeholder="eg. /documents/file/names.txt" />
    </div>
  );
}

type TSelectDispatchRef = {
  current: (
    props: TSelectAction["props"],
    dispatch: any,
    actionId: string
  ) => void;
};
function Select({
  action,
  current,
  dispatch,
}: {
  action: TSelectAction;
  current: any;
  dispatch: any;
}) {
  const SelectDispatchRef: TSelectDispatchRef = React.useRef(
    debounce((props, dispatch, actionId) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Select",
        props,
        actionId,
      });
    }, DEBOUNCE_DELAY)
  );

  function handleSelectChange(e) {
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
  }

  return (
    <div className="flex-column mt">
      <div className="flex-column">
        <label className="fw-bold txt-clr fs-md">Value</label>
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
        <label className="fw-bold txt-clr fs-md">Description</label>
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
      <label className="fw-bold txt-clr fs-md">Date</label>
      <input type="text" />
    </div>
  );
}

function Prompts({ action, current, dispatch }) {
  return (
    <div className="flex-column mt">
      <label className="fw-bold txt-clr fs-md">Response Type</label>
      <select>
        <option>Accept</option>
        <option>Decline</option>
      </select>
      <div className="flex-column mt txt-clr fs-md">
        <div className="fw-bold">Response Text (Optional)</div>
        <input type="text" />
      </div>
    </div>
  );
}

function Code({ action, actions, current, dispatch }) {
  return (
    <Editor
      actions={actions}
      actionId={action.id}
      actionProps={action.props}
      dispatch={dispatch}
    />
  );
}

export default function Interaction({
  action,
  actions,
  current,
  dispatch,
}: {
  action: IntAction;
  actions: TAction;
  current: any;
  dispatch: any;
}) {
  const actionName = action.actionType;

  return (
    <>
      {actionName != "Prompts" && actionName != "Code" && (
        <Common action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Code" && (
        <Code
          action={action}
          actions={actions}
          current={current}
          dispatch={dispatch}
        />
      )}
      {actionName === "Type" && (
        <Type action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Date" && (
        <Date action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Click" && (
        <Click action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Hover" && (
        <Hover action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Scroll" && (
        <Scroll action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Upload" && (
        <Upload action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Select" && (
        <Select action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Prompts" && (
        <Prompts action={action} current={current} dispatch={dispatch} />
      )}
      {actionName === "Keypress" && (
        <Keypress
          action={action as TKeypressAction}
          current={current}
          dispatch={dispatch}
        />
      )}
    </>
  );
}
