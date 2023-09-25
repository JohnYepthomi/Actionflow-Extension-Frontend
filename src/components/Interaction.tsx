import Editor from "./Editor.jsx";
import React from "react";
import type {
  TAction,
  TCommonProps,
  TIntAction,
  TResolveAction,
} from "../Schemas/replaceTypes/Actions.js";
import type { TAppEvents } from "../Schemas/replaceTypes/StateEvents.js";
import messageTab from "../utils/messageTab";

function debounce(fn: any, ms: any) {
  let timer: number | undefined;
  return function () {
    // console.log("timerId: ", timer);
    clearTimeout(timer);
    const context = debounce;
    const args = arguments;

    timer = setTimeout(function () {
      console.log("Interaction: DEBOUNCING DISPATCH ARGS: ", args);
      timer = undefined;
      fn.apply(context, args);
    }, ms);
  };
}

const DEBOUNCE_DELAY = 0;

type TDispatchRef<T> = (
  props: T extends { props: infer P }
    ? P
    : T extends { nodeName: string; selector: string }
    ? T
    : never,
  dispatch: any,
  actionId: string
) => void;

function Common({ action, dispatch }: { action: TIntAction; dispatch: any }) {
  const commomDispatchRef = React.useRef<TDispatchRef<TCommonProps>>(
    debounce((selector: any, dispatch: any, actionId: any) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props: selector,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handlePickElement = React.useCallback(
    (action: TAction) => {
      if (
        [
          "Type",
          "Select",
          "URL",
          "Click",
          "List",
          "Text",
          "Attribute",
          "Anchor",
        ].includes(action.actionType)
      ) {
        console.log(
          "Messaging ContentScript -> 'element-pick', actionType: ",
          action.actionType
        );
        messageTab({ message: "element-pick", payload: action });
      }
    },
    [action]
  );

  const handleSelectorChange = React.useCallback(
    (e: any) => {
      if (
        "props" in action &&
        action.actionType !== "URL" &&
        action.actionType !== "Code"
      ) {
        commomDispatchRef.current(
          { nodeName: action.props.nodeName, selector: e.target.value },
          dispatch,
          action.id
        );
      }
    },
    [action]
  );

  return (
    <div className="common flex-column">
      <div className="fs-md txt-clr">Selector</div>
      <div className="flex-row align-center">
        <input
          className="flex-1"
          type="text"
          placeholder="Css Selector"
          value={
            "props" in action &&
            action.actionType !== "URL" &&
            action.actionType !== "Code"
              ? action.props.selector
              : ""
          }
          onChange={handleSelectorChange}
        />
        <button className="button-60" onClick={() => handlePickElement(action)}>
          Pick
        </button>
      </div>
    </div>
  );
}

function Scroll({ action, dispatch }: { action: any; dispatch: any }) {
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

type TClickAction = TResolveAction<"Click">;
type TClickProps = TClickAction["props"];
type TClickParams = { action: TClickAction; dispatch: any };

function Click({ action, dispatch }: TClickParams) {
  const dbounceRef = React.useRef<TDispatchRef<TClickProps>>(
    debounce((props: TClickProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: { props, actionId },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleClickProps = React.useCallback(
    (e: any) => {
      const propName = e.target.getAttribute("data-proptype");

      if (propName === "Wait For New Page To Load") {
        dbounceRef.current(
          { ...action.props, "Wait For New Page To Load": e.target.checked },
          dispatch,
          action.id
        );
      }
      if (propName === "Wait For File Download") {
        dbounceRef.current(
          { ...action.props, "Wait For File Download": e.target.checked },
          dispatch,
          action.id
        );
      }
      if (propName === "Description") {
        dbounceRef.current(
          { ...action.props, Description: e.target.value },
          dispatch,
          action.id
        );
      }
    },
    [action]
  );

  return (
    <div className="flex-column mt">
      <div className="flex-row align-center fs-md">
        <input
          type="checkbox"
          defaultChecked={action.props["Wait For New Page To Load"]}
          data-proptype="Wait For New Page To load"
          onChange={handleClickProps}
        />
        Wait for New Page to Load
      </div>

      <div className="flex-row align-center fs-md">
        <input
          type="checkbox"
          defaultChecked={action.props["Wait For File Download"]}
          data-proptype="Wait For File Download"
          onChange={handleClickProps}
        />
        Wait For File Download
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

type TTypeAction = TResolveAction<"Type">;
type TTypeProps = TTypeAction["props"];
type TTypeParams = {
  action: TTypeAction;
  dispatch: any;
};

function Type({ action, dispatch }: TTypeParams) {
  const dbounceRef = React.useRef<TDispatchRef<TTypeProps>>(
    debounce((props: TTypeProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleTypePropChange = React.useCallback(
    (e: any) => {
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
    },
    [action]
  );

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

type THoverAction = TResolveAction<"Hover">;
type THoverProps = THoverAction["props"];
type THoverParams = { action: THoverAction; dispatch: any };

function Hover({ action, dispatch }: THoverParams) {
  const dbounceRef = React.useRef<TDispatchRef<THoverProps>>(
    debounce((props: THoverProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handlerDescriptionChange = React.useCallback(
    (e: any) => {
      dbounceRef.current(
        { ...action.props, Description: e.target.value },
        dispatch,
        action.id
      );
    },
    [action]
  );

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

type TKeypressAction = TResolveAction<"Keypress">;
type TKeypressProps = TKeypressAction["props"];
type TkeypressParams = { action: TKeypressAction; dispatch: any };
function Keypress({ action, dispatch }: TkeypressParams) {
  const keypressDispatchRef = React.useRef<TDispatchRef<TKeypressProps>>(
    debounce((props: TKeypressProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props: props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  function handleKeypressChange(e: any) {
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

function Upload({ action, dispatch }: { action: any; dispatch: any }) {
  return (
    <div className="flex-column mt">
      <label className="fs-md">Path</label>
      <input type="text" placeholder="eg. /documents/file/names.txt" />
    </div>
  );
}

type TSelectAction = TResolveAction<"Select">;
type TSelectProps = TSelectAction["props"];
type TSelectParams = { action: TSelectAction; dispatch: any };

function Select({ action, dispatch }: TSelectParams) {
  const SelectDispatchRef = React.useRef<TDispatchRef<TSelectAction>>(
    debounce((props: TSelectProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleSelectChange = React.useCallback(
    (e: any) => {
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
    },
    [action]
  );

  return (
    <div className="flex-column mt">
      <div className="flex-column">
        <label className="fs-md">Value</label>
        {/* <input type="text" value={selectProps["Value"]} data-proptype="select-value" onChange={handleSelectChange} /> */}
        <select>
          {action.props?.Options?.map((option, index) => {
            return (
              <option key={index} selected={option === action.props.Selected}>
                {option}
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

function Date({ action, dispatch }: { action: any; dispatch: any }) {
  return (
    <div className="flex-column mt">
      <label className="fs-md">Date</label>
      <input type="text" />
    </div>
  );
}

function Prompts({ action, dispatch }: { action: any; dispatch: any }) {
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

type TCodeAction = TResolveAction<"Code">;
type TCodeParams = { action: TCodeAction; actions: TAction[]; dispatch: any };

function Code({ action, actions, dispatch }: TCodeParams) {
  return (
    <Editor
      actions={actions}
      actionId={action.id}
      actionProps={action.props}
      dispatch={dispatch}
    />
  );
}

type TListAction = TResolveAction<"List">;
type TListProps = TListAction["props"];
type TListParams = { action: TListAction; dispatch: any };

function List({ action, dispatch }: TListParams) {
  const ListDispatchRef = React.useRef<TDispatchRef<TListAction>>(
    debounce((props: TListProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleListChange = React.useCallback(
    (e: any) => {
      ListDispatchRef.current(
        { ...action.props, variable: e.target.value },
        dispatch,
        action.id
      );
    },
    [action]
  );

  return (
    <>
      <div className="flex-column mt txt-clr fs-md">
        <div className="fs-md">Variable</div>
        <div className="flex-row mt txt-clr fs-md">
          <div className="dollar-prefix">$</div>
          <input
            className="w-100"
            value={action.props.variable}
            onChange={handleListChange}
            type="text"
            data-variable="true"
            placeholder="variable name. Refer to this variable using '$ + variable_name'"
          />
        </div>
      </div>
    </>
  );
}

type TTextAction = TResolveAction<"Text">;
type TTextProps = TTextAction["props"];
type TTextParams = { action: TTextAction; dispatch: any };

function Text({ action, dispatch }: TTextParams) {
  const TextDispatchRef = React.useRef<TDispatchRef<TTextAction>>(
    debounce((props: TTextProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleTextChange = React.useCallback(
    (e: any) => {
      TextDispatchRef.current(
        { ...action.props, variable: e.target.value },
        dispatch,
        action.id
      );
    },
    [action]
  );

  return (
    <>
      <div className="flex-column mt txt-clr fs-md">
        <div className="fs-md">Variable</div>
        <div className="flex-row mt txt-clr fs-md">
          <div className="dollar-prefix">$</div>
          <input
            className="w-100"
            value={action.props.variable}
            onChange={handleTextChange}
            type="text"
            data-variable="true"
            placeholder="variable name. Refer to this variable using '$ + variable_name'"
          />
        </div>
      </div>
    </>
  );
}

type TAttributeAction = TResolveAction<"Attribute">;
type TAttributeProps = TAttributeAction["props"];
type TAttributeParams = { action: TAttributeAction; dispatch: any };

function Attribute({ action, dispatch }: TAttributeParams) {
  const AttributeDispatchRef = React.useRef<TDispatchRef<TAttributeAction>>(
    debounce((props: TAttributeProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleAttributeChange = React.useCallback(
    (e: any) => {
      const propType = e.target.getAttribute("data-proptype");
      // if (propType !== "attribute" || propType !== "variable") return;

      console.log(
        "handleAttributeChange propType: ",
        propType,
        ", target-value:",
        e.target.value
      );

      AttributeDispatchRef.current(
        { ...action.props, [propType]: e.target.value },
        dispatch,
        action.id
      );
    },
    [action]
  );

  return (
    <>
      <div className="flex-column mt txt-clr fs-md">
        <div className="fs-md">Attribute</div>
        <input
          className="w-100"
          value={action.props.attribute}
          type="text"
          data-proptype="attribute"
          onChange={handleAttributeChange}
          placeholder="attribute name"
        />
        <div className="fs-md">Variable</div>
        <div className="flex-row mt txt-clr fs-md">
          <div className="dollar-prefix">$</div>
          <input
            className="w-100"
            value={action.props.variable}
            onChange={handleAttributeChange}
            type="text"
            data-proptype="variable"
            data-variable="true"
            placeholder="variable name. Refer to this variable using '$ + variable_name'"
          />
        </div>
      </div>
    </>
  );
}

type TAnchorAction = TResolveAction<"Anchor">;
type TAnchorProps = TAnchorAction["props"];
type TAnchorParams = { action: TAnchorAction; dispatch: any };

function Link({ action, dispatch }: TAnchorParams) {
  const LinkDispatchRef = React.useRef<TDispatchRef<TAnchorAction>>(
    debounce((props: TAnchorProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleLinkChange = React.useCallback(
    (e: any) => {
      LinkDispatchRef.current(
        { ...action.props, variable: e.target.value },
        dispatch,
        action.id
      );
    },
    [action]
  );

  return (
    <>
      <div className="flex-column mt txt-clr fs-md">
        <div className="fs-md">Variable</div>
        <div className="flex-row mt txt-clr fs-md">
          <div className="dollar-prefix">$</div>
          <input
            className="w-100"
            value={action.props.variable}
            onChange={handleLinkChange}
            type="text"
            data-variable="true"
            placeholder="variable name. Refer to this variable using '$ + variable_name'"
          />
        </div>
      </div>
    </>
  );
}

type TURLAction = TResolveAction<"URL">;
type TURLProps = TURLAction["props"];
type TURLParams = { action: TURLAction; dispatch: any };

function URL({ action, dispatch }: TURLParams) {
  const URLDispatchRef = React.useRef<TDispatchRef<TURLAction>>(
    debounce((props: TURLProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  const handleURLChange = React.useCallback(
    (e: any) => {
      URLDispatchRef.current(
        { ...action.props, variable: e.target.value },
        dispatch,
        action.id
      );
    },
    [action]
  );

  return (
    <>
      <div className="flex-column mt txt-clr fs-md">
        <div className="fs-md">Variable</div>
        <div className="flex-row mt txt-clr fs-md">
          <div className="dollar-prefix">$</div>
          <input
            className="w-100"
            value={action.props.variable}
            onChange={handleURLChange}
            type="text"
            data-variable="true"
            placeholder="variable name. Refer to this variable using '$ + variable_name'"
          />
        </div>
      </div>
    </>
  );
}

export default function Interaction({
  action,
  actions,
  current,
  dispatch,
}: {
  action: TIntAction;
  actions: TAction[];
  current: any;
  dispatch: any;
}) {
  const actionName = action.actionType;

  return (
    <>
      {!["Keypress", "URL", "Prompts", "Code"].includes(actionName) && (
        <Common action={action} dispatch={dispatch} />
      )}
      {actionName === "Code" && (
        <Code action={action} actions={actions} dispatch={dispatch} />
      )}
      {actionName === "Type" && <Type action={action} dispatch={dispatch} />}
      {actionName === "Date" && <Date action={action} dispatch={dispatch} />}
      {actionName === "Click" && <Click action={action} dispatch={dispatch} />}
      {actionName === "Hover" && <Hover action={action} dispatch={dispatch} />}
      {actionName === "Scroll" && (
        <Scroll action={action} dispatch={dispatch} />
      )}
      {actionName === "Upload" && (
        <Upload action={action} dispatch={dispatch} />
      )}
      {actionName === "Select" && (
        <Select action={action} dispatch={dispatch} />
      )}
      {actionName === "Prompts" && (
        <Prompts action={action} dispatch={dispatch} />
      )}
      {actionName === "Keypress" && (
        <Keypress action={action as TKeypressAction} dispatch={dispatch} />
      )}
      {actionName === "List" && (
        <List action={action as TListAction} dispatch={dispatch} />
      )}
      {actionName === "Text" && (
        <Text action={action as TTextAction} dispatch={dispatch} />
      )}
      {actionName === "Attribute" && (
        <Attribute action={action as TAttributeAction} dispatch={dispatch} />
      )}
      {actionName === "Anchor" && (
        <Link action={action as TAnchorAction} dispatch={dispatch} />
      )}
      {actionName === "URL" && (
        <URL action={action as TURLAction} dispatch={dispatch} />
      )}
    </>
  );
}
