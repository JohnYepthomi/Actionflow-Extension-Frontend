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
import {
  Box,
  HStack,
  VStack,
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
  Select as TSelect,
} from "@chakra-ui/react";

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

const DEBOUNCE_DELAY = 300;

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
  const [selector, setSelector] = React.useState(
    "props" in action &&
      action.actionType !== "URL" &&
      action.actionType !== "Code"
      ? action.props.selector
      : ""
  );

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
        setSelector(e.target.value);
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
    <VStack alignItems="flex-start" w="100%">
      <Box>Selector</Box>
      <HStack w="100%">
        <Input
          placeholder="Css Selector"
          value={selector}
          onChange={handleSelectorChange}
        />
        <Button onClick={() => handlePickElement(action)}>Pick</Button>
      </HStack>
    </VStack>
  );
}

function Scroll({ action, dispatch }: { action: any; dispatch: any }) {
  return (
    <VStack alignItems="flex-start" w="100%">
      <VStack w="100%" alignItems="flex-start" mt={2}>
        <Box>Scroll Direction</Box>
        <TSelect>
          <option>Scroll Top</option>
          <option>Scroll Bottom</option>
        </TSelect>
      </VStack>

      <VStack alignItems="flex-start" w="100%" mt={2}>
        <Box>Description</Box>
        <Input placeholder="Enter description" />
      </VStack>
    </VStack>
  );
}

type TClickAction = TResolveAction<"Click">;
type TClickProps = TClickAction["props"];
type TClickParams = { action: TClickAction; dispatch: any };

function Click({ action, dispatch }: TClickParams) {
  const [waitForPageLoad, setWaitForPageLoad] = React.useState<boolean>(
    action.props["Wait For New Page To Load"]
  );
  const [waitForFileDownload, setWaitForFileDownload] = React.useState<boolean>(
    action.props["Wait For File Download"]
  );
  const [description, setDescription] = React.useState<string>(
    action.props["Description"]
  );

  const dbounceRef = React.useRef<TDispatchRef<TClickProps>>(
    debounce((props: TClickProps, dispatch: any, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: { props, actionId },
      } satisfies TAppEvents);
    }, DEBOUNCE_DELAY)
  );

  return (
    <VStack alignItems="flex-start" w="100%" mt={2}>
      <HStack>
        <Checkbox
          isChecked={waitForPageLoad}
          onChange={(e: any) => {
            setWaitForPageLoad(e.target.checked);
            dbounceRef.current(
              {
                ...action.props,
                "Wait For New Page To Load": e.target.checked,
              },
              dispatch,
              action.id
            );
          }}
        />
        <Box>Wait for New Page to Load </Box>
      </HStack>

      <HStack>
        <Checkbox
          isChecked={waitForFileDownload}
          onChange={(e: any) => {
            setWaitForFileDownload(e.target.checked);
            dbounceRef.current(
              { ...action.props, "Wait For File Download": e.target.checked },
              dispatch,
              action.id
            );
          }}
        />
        <Box>Wait For File Download </Box>
      </HStack>

      <VStack alignItems="flex-start" w="100%" mt={2}>
        <Box>Description (optional)</Box>
        <Input
          placeholder="Enter description"
          value={description}
          onChange={(e: any) => {
            setDescription(e.target.value);
            dbounceRef.current(
              { ...action.props, Description: e.target.value },
              dispatch,
              action.id
            );
          }}
        />
      </VStack>
    </VStack>
  );
}

type TTypeAction = TResolveAction<"Type">;
type TTypeProps = TTypeAction["props"];
type TTypeParams = {
  action: TTypeAction;
  dispatch: any;
};

function Type({ action, dispatch }: TTypeParams) {
  const [text, setText] = React.useState(action.props.Text);
  const [overwriteText, setOverwriteText] = React.useState(
    action.props["Overwrite Existing Text"]
  );

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

  return (
    <VStack alignItems="flex-start" w="100%">
      <VStack alignItems="flex-start" w="100%">
        <Box fontSize="0.75rem">Text</Box>
        <Input
          type="text"
          placeholder="Type Text"
          value={text}
          onChange={(e: any) => {
            setText(e.target.value);
            dbounceRef.current(
              { ...action.props, Text: e.target.value },
              dispatch,
              action.id
            );
          }}
        />
      </VStack>
      <HStack w="100%">
        <Checkbox
          onChange={(e: any) => {
            setOverwriteText(e.target.checked);
            dbounceRef.current(
              { ...action.props, "Overwrite Existing Text": e.target.checked },
              dispatch,
              action.id
            );
          }}
          isChecked={overwriteText}
        >
          Overwrite Existing Text
        </Checkbox>
      </HStack>
    </VStack>
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

  return (
    <VStack alignItems="flex-start" w="100%" mt={2}>
      <Box>Description (Optional)</Box>
      <Input
        placeholder="Enter description"
        value={action.props["Description"]}
        onChange={(e: any) =>
          dbounceRef.current(
            { ...action.props, Description: e.target.value },
            dispatch,
            action.id
          )
        }
      />
    </VStack>
  );
}

type TKeypressAction = TResolveAction<"Keypress">;
type TKeypressProps = TKeypressAction["props"];
type TkeypressParams = { action: TKeypressAction; dispatch: any };
function Keypress({ action, dispatch }: TkeypressParams) {
  const [key, setKey] = React.useState(action.props["Key"]);
  const [waitForPageLoad, setWaitForPageLoad] = React.useState(
    action.props["Wait For Page To Load"]
  );
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

  return (
    <VStack alignItems="flex-start" w="100%">
      <VStack alignItems="flex-start" w="100%">
        <Box>Key</Box>
        <HStack w="100%">
          <Input
            value={key}
            placeholder="Enter Key"
            onChange={(e: any) => {
              setKey(e.target.key);
              keypressDispatchRef.current(
                { ...action.props, Key: e.target.value },
                dispatch,
                action.id
              );
            }}
          />
          <Button w="20%">Detect</Button>
        </HStack>
      </VStack>

      <HStack>
        <Checkbox
          isChecked={waitForPageLoad}
          onChange={(e: any) => {
            setWaitForPageLoad(e.target.checked);
            keypressDispatchRef.current(
              { ...action.props, "Wait For Page To Load": e.target.checked },
              dispatch,
              action.id
            );
          }}
        />
        <Box> Wait for new page to load</Box>
      </HStack>
    </VStack>
  );
}

function Upload({ action, dispatch }: { action: any; dispatch: any }) {
  return (
    <VStack alignItems="flex-start" w="100%" mt={2}>
      <Box>Path</Box>
      <Input placeholder="eg. /documents/file/names.txt" />
    </VStack>
  );
}

type TSelectAction = TResolveAction<"Select">;
type TSelectProps = TSelectAction["props"];
type TSelectParams = { action: TSelectAction; dispatch: any };

function Select({ action, dispatch }: TSelectParams) {
  const [description, setDescription] = React.useState<string>(
    action.props.Description
  );
  const [selected, setSelected] = React.useState(action.props.Selected);

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

  return (
    <VStack w="100%">
      <VStack alignItems="flex-start" w="100%" mt={2}>
        <Box>Value</Box>
        <TSelect
          onChange={(e: any) => {
            setSelected(e.target.value);
            SelectDispatchRef.current(
              { ...action.props, Selected: e.target.value },
              dispatch,
              action.id
            );
          }}
        >
          {action.props?.Options?.map((option, index) => {
            return (
              <option
                key={index}
                selected={option.toUpperCase() === selected.toUpperCase()}
              >
                {option}
              </option>
            );
          })}
        </TSelect>
      </VStack>

      <VStack alignItems="flex-start" w="100%" mt={2}>
        <Box>Description</Box>
        <Input
          placeholder="Enter Description"
          value={description}
          onChange={(e: any) => {
            setDescription(e.target.value);
            SelectDispatchRef.current(
              { ...action.props, Description: e.target.value },
              dispatch,
              action.id
            );
          }}
        />
      </VStack>
    </VStack>
  );
}

function Date({ action, dispatch }: { action: any; dispatch: any }) {
  return (
    <VStack alignItems="flex-start" w="100%" mt={2}>
      <Box className="fs-md">Date</Box>
      <Input type="text" placeholder="Select Date" />
    </VStack>
  );
}

function Prompts({ action, dispatch }: { action: any; dispatch: any }) {
  return (
    <VStack alignItems="flex-start" w="100%">
      <VStack alignItems="flex-start" w="100%">
        <Box>Response Type</Box>
        <TSelect>
          <option>Accept</option>
          <option>Decline</option>
        </TSelect>
      </VStack>

      <VStack alignItems="flex-start" w="100%" mt={2}>
        <Box>Response Text (Optional)</Box>
        <Input type="text" placeholder="Enter Response Text" />
      </VStack>
    </VStack>
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
  const [variable, setVariable] = React.useState(action.props.variable);

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

  return (
    <VStack alignItems="flex-start" w="100%" mt={2}>
      <Box>Variable</Box>
      <HStack w="100%">
        <Box className="dollar-prefix">$</Box>
        <Input
          value={variable}
          onChange={(e: any) => {
            setVariable(e.target.value);
            ListDispatchRef.current(
              { ...action.props, variable: e.target.value },
              dispatch,
              action.id
            );
          }}
          placeholder="variable name. Refer to this variable using '$ + variable_name'"
        />
      </HStack>
    </VStack>
  );
}

type TTextAction = TResolveAction<"Text">;
type TTextProps = TTextAction["props"];
type TTextParams = { action: TTextAction; dispatch: any };

function Text({ action, dispatch }: TTextParams) {
  const [variable, setVariable] = React.useState(action.props.variable);

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

  return (
    <VStack alignItems="flex-start" w="100%" mt={2}>
      <Box>Variable</Box>
      <HStack w="100%">
        <Box>$</Box>
        <Input
          id="action-variable"
          value={variable}
          onChange={(e: any) => {
            setVariable(e.target.value);
            TextDispatchRef.current(
              { ...action.props, variable: e.target.value },
              dispatch,
              action.id
            );
          }}
          type="text"
          placeholder="variable name"
        />
      </HStack>
    </VStack>
  );
}

type TAttributeAction = TResolveAction<"Attribute">;
type TAttributeProps = TAttributeAction["props"];
type TAttributeParams = { action: TAttributeAction; dispatch: any };

function Attribute({ action, dispatch }: TAttributeParams) {
  const [variable, setVariable] = React.useState(action.props.variable);
  const [attribute, setAttribute] = React.useState(action.props.attribute);
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

  return (
    <VStack w="100%">
      <VStack alignItems="flex-start" mt={2} w="100%">
        <Box>Attribute</Box>
        <Input
          value={attribute}
          onChange={(e: any) => {
            setAttribute(e.target.value);
            AttributeDispatchRef.current(
              { ...action.props, attribute: e.target.value },
              dispatch,
              action.id
            );
          }}
          placeholder="attribute name"
        />
      </VStack>

      <VStack alignItems="flex-start" mt={2} w="100%">
        <Box>Variable</Box>
        <HStack w="100%">
          <Box>$</Box>
          <Input
            value={variable}
            onChange={(e: any) => {
              setVariable(e.target.value);
              AttributeDispatchRef.current(
                { ...action.props, variable: e.target.value },
                dispatch,
                action.id
              );
            }}
            placeholder="variable name. Refer to this variable using '$ + variable_name'"
          />
        </HStack>
      </VStack>
    </VStack>
  );
}

type TAnchorAction = TResolveAction<"Anchor">;
type TAnchorProps = TAnchorAction["props"];
type TAnchorParams = { action: TAnchorAction; dispatch: any };

function Anchor({ action, dispatch }: TAnchorParams) {
  const AnchorDispatchRef = React.useRef<TDispatchRef<TAnchorAction>>(
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

  const handleAnchorChange = React.useCallback(
    (e: any) => {
      AnchorDispatchRef.current(
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
            onChange={handleAnchorChange}
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
  const [variable, setVariable] = React.useState(action.props.variable);
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

  return (
    <VStack w="100%" alignItems="flex-start">
      <Box>Variable</Box>
      <HStack w="100%">
        <Box>$</Box>
        <Input
          value={variable}
          onChange={(e: any) => {
            setVariable(e.target.value);
            URLDispatchRef.current(
              { ...action.props, variable: e.target.value },
              dispatch,
              action.id
            );
          }}
          placeholder="variable name. Refer to this variable using '$ + variable_name'"
        />
      </HStack>
    </VStack>
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
        <Anchor action={action as TAnchorAction} dispatch={dispatch} />
      )}
      {actionName === "URL" && (
        <URL action={action as TURLAction} dispatch={dispatch} />
      )}
    </>
  );
}
