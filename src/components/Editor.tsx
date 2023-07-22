import CodeMirror from "@uiw/react-codemirror";
import { historyField } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import React from "react";

const stateFields = { history: historyField };

function debounce(fn, ms) {
  let timer;
  return function () {
    // console.log("timerId: ", timer);
    clearTimeout(timer);
    const context = this;
    const args = arguments;

    timer = setTimeout(function () {
      console.log("Actually dispatching event to State machine", args);
      timer = null;
      fn.apply(context, args);
    }, ms);
  };
}

type TCodeDispatchRef = {
  current: (dispatch: any, props: TCode, actionId: string) => void;
};
type TCode = {
  vars: string[];
  value: string;
};

export default function Editor({ actions, actionId, actionProps, dispatch }) {
  const codeDispatchRef: TCodeDispatchRef = React.useRef(
    debounce((dispatch: any, props: TCode, actionId: string) => {
      dispatch({
        type: "UPDATE_INTERACTION",
        propType: "Code",
        props,
        actionId,
      });
    }, 700)
  );

  const [code, setCode] = React.useState<TCode>({
    value: actionProps.value,
    vars: actionProps.vars,
  });

  function myCompletions(context) {
    let before = context.matchBefore(/\w+/);
    // If completion wasn't explicitly started and there
    // is no word before the cursor, don't open completions.
    if (!context.explicit && !before) return null;

    let code_actions =
      actions && actions.filter((action) => action.actionType === "Code");
    let all_vars;

    try {
      all_vars = code_actions.reduce((combined, { props }, index) => {
        if (props && props?.vars) return [...combined, ...props.vars];
        else return [...combined];
      }, []);
    } catch (error) {
      console.error(error);
    }

    return {
      from: before ? before.from : context.pos,
      options: all_vars ? all_vars : [],
      validFor: /^\w*$/,
    };
  }

  React.useEffect(() => {
    codeDispatchRef.current(dispatch, code, actionId);
  }, [code]);

  let extractVarLabels = (code_string) => {
    const variableRegex = /(?:var|let|const)\s+([\w$]+)\s*=\s*([^;]+)/g;
    const variables = [];
    let match;
    while ((match = variableRegex.exec(code_string)) !== null) {
      try {
        const variableName = match[1];
        const variableValue = eval(match[2]);
        variables.push({ label: variableName, type: "variable" });
      } catch (error) {
        console.warn("Error In fn extractVarLabels(), error: ", error);
      }
    }

    return variables;
  };

  return (
    <CodeMirror
      theme="dark"
      value={code?.value ? code?.value : ""}
      initialState={
        actionProps.history
          ? { json: actionProps.history, fields: stateFields }
          : undefined
      }
      extensions={[
        javascript({ jsx: false }),
        autocompletion({ override: [myCompletions] }),
      ]} //
      onChange={(value, viewUpdate) => {
        // const old_state = viewUpdate.state.toJSON(stateFields); // History
        const vars = extractVarLabels(value);
        setCode((state) => ({ value, vars }));
      }}
    />
  );
}
