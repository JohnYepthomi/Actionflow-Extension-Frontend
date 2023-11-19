import CodeMirror from "@uiw/react-codemirror";
import { historyField } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import React from "react";
import { TUpdateInteractionActionEvent } from "../Schemas/replaceTypes/StateEvents";

const stateFields = { history: historyField };

function debounce(fn: any, ms: any) {
  let timer: number | undefined;
  return function () {
    // console.log("timerId: ", timer);
    clearTimeout(timer);
    const context = debounce;
    const args = arguments;

    timer = setTimeout(function () {
      console.log("Actually dispatching event to State machine", args);
      timer = undefined;
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
type TEditorParams = {
  actions: any;
  actionId: string;
  actionProps: any;
  dispatch: any;
};

// Note: This list may not be exhaustive, and JavaScript may introduce new keywords in future versions.
const javascriptKeywords = [
  { label: "break", type: "keyword" },
  { label: "byte", type: "keyword" },
  { label: "case", type: "keyword" },
  { label: "catch", type: "keyword" },
  { label: "char", type: "keyword" },
  { label: "class", type: "keyword" },
  { label: "const", type: "keyword" },
  { label: "continue", type: "keyword" },
  { label: "debugger", type: "keyword" },
  { label: "default", type: "keyword" },
  { label: "delete", type: "keyword" },
  { label: "do", type: "keyword" },
  { label: "double", type: "keyword" },
  { label: "else", type: "keyword" },
  { label: "enum", type: "keyword" },
  { label: "eval", type: "keyword" },
  { label: "export", type: "keyword" },
  { label: "extends", type: "keyword" },
  { label: "false", type: "keyword" },
  { label: "finally", type: "keyword" },
  { label: "float", type: "keyword" },
  { label: "for", type: "keyword" },
  { label: "function", type: "keyword" },
  { label: "goto", type: "keyword" },
  { label: "if", type: "keyword" },
  { label: "implements", type: "keyword" },
  { label: "import", type: "keyword" },
  { label: "in", type: "keyword" },
  { label: "instanceof", type: "keyword" },
  { label: "int", type: "keyword" },
  { label: "interface", type: "keyword" },
  { label: "let", type: "keyword" },
  { label: "long", type: "keyword" },
  { label: "native", type: "keyword" },
  { label: "new", type: "keyword" },
  { label: "null", type: "keyword" },
  { label: "package", type: "keyword" },
  { label: "private", type: "keyword" },
  { label: "protected", type: "keyword" },
  { label: "public", type: "keyword" },
  { label: "return", type: "keyword" },
  { label: "short", type: "keyword" },
  { label: "static", type: "keyword" },
  { label: "super", type: "keyword" },
  { label: "switch", type: "keyword" },
  { label: "synchronized", type: "keyword" },
  { label: "this", type: "keyword" },
  { label: "throw", type: "keyword" },
  { label: "throws", type: "keyword" },
  { label: "transient", type: "keyword" },
  { label: "true", type: "keyword" },
  { label: "try", type: "keyword" },
  { label: "typeof", type: "keyword" },
  { label: "var", type: "keyword" },
  { label: "void", type: "keyword" },
  { label: "volatile", type: "keyword" },
  { label: "while", type: "keyword" },
  { label: "with", type: "keyword" },
  { label: "yield", type: "keyword" },
  { label: "abstract", type: "keyword" },
  { label: "arguments", type: "keyword" },
  { label: "await", type: "keyword" },
  { label: "boolean", type: "keyword" },
];

export default function Editor({
  actions,
  actionId,
  actionProps,
  dispatch,
}: TEditorParams) {
  const codeDispatchRef: TCodeDispatchRef = React.useRef(
    debounce((dispatch: any, props: TCode, actionId: string) => {
      console.log("::::PROPS.VARS::::  ", props);
      dispatch({
        type: "UPDATE_INTERACTION",
        payload: {
          props,
          actionId,
        },
      } satisfies TUpdateInteractionActionEvent);
    }, 700)
  );
  const [code, setCode] = React.useState<TCode>({
    value: actionProps.value,
    vars: actionProps.vars,
  });
  const [noPrefixLocalCompletions, setNoPrefixLocalCompletions] = React.useState<{ label: string, type: string }[]>([]);

  function myCompletions(context: any) {
    /*********************************************************************************
      before contains only matched string abnd can be null of not match found.
      [from: position where typing started]  and [to: position where the typing ended]
    *********************************************************************************/
    let before = context.matchBefore(/\S+/);

    /*********************************************************************************
      If completion wasn't explicitly started and there
      is no any 'matched' word before the cursor, don't open completions.
    *********************************************************************************/
    if (!context.explicit && !before) return null;

    /*********************************************************************************
     if you want to get the currently typed text
    *********************************************************************************/
    //const currentlyTyped = context.state.doc.slice(before.from, context.pos);

    /*********************************************************************************
      filter code actions from actions.
    *********************************************************************************/
    let discardAction = false;
    let code_actions = actions && actions.filter((action: any, index: number) => {
      if (!discardAction) {
        if (action.id === actionId && 'props' in action && ("vars" in action.props || "variable" in action.props)) {
          discardAction = true;
        }

        return true;
      }

      if (discardAction) {
        return false;
      }
    });

    /**********************************************************************************
      Get the variables from actions that have either 'props.vars' or 'props.variable'
    **********************************************************************************/
    let prefixedCompletions = [];
    try {
      prefixedCompletions = code_actions.reduce(
        (combined: any, { props }: any, index: any) => {
          if (props && props?.vars)
            return [...combined, ...props.vars.map((v: any) => { return { label: v, type: "variable" } })] //, apply: v.substring(1) 
          else if (props && props?.variable)
            return [...combined, { label: '$' + props.variable, type: "variable" }] //, apply: v.substring(1) 
          else return [...combined];
        },
        []
      );
    } catch (error) {
      console.error(error);
    }

    /*********************************************************************************
      Add the jskeywords, prefixed and non prefixed Completions
    *********************************************************************************/
    prefixedCompletions = [...prefixedCompletions, ...(noPrefixLocalCompletions || []), ...javascriptKeywords]

    return {
      from: before ? before.from : context.pos,
      options: prefixedCompletions,
      // validFor: /^\w*$/,
    };
  }

  React.useEffect(() => {
    codeDispatchRef.current(dispatch, code, actionId);
  }, [code]);

  const extractVarLabels = (code_string: string) => {
    const variableRegex = /(?:var|let|const)\s+([\w$]+)\s*=\s*([^;]+)/g;
    const variables = [];

    let match;
    while ((match = variableRegex.exec(code_string)) !== null) {
      const variableName = match[1];
      variables.push({ label: variableName, type: 'variable' });
    }

    return variables;
  };

  return (
    <CodeMirror
      theme="dark"
      value={code?.value ?? ""}
      initialState={
        actionProps.history
          ? { json: actionProps.history, fields: stateFields }
          : undefined
      }
      extensions={[
        javascript({ jsx: false }),
        autocompletion({ override: [myCompletions] }),
      ]}
      onChange={(value, viewUpdate) => {
        const old_state = viewUpdate.state.toJSON(stateFields); // History
        let prefixedVars = extractVarLabels(value);

        /******************
          filter variables
        *******************/
        let noPrefixVars: { label: string, type: string }[];
        if (prefixedVars && prefixedVars.length > 0) {
          noPrefixVars = prefixedVars.filter(v => {
            console.log({ v });
            if (!v.label.includes("$"))
              return true;
            else
              return false;
          });
          prefixedVars = prefixedVars.filter(v => {
            if (v.label.includes("$"))
              return true;
            else
              return false;
          });
        }

        /***********************************************************************************************
          'noPrefixVars' is only used for local state, this will not be associated to Code Action Props 
        ***********************************************************************************************/
        setNoPrefixLocalCompletions(state => noPrefixVars || []);

        /************************************************************************************
         * We only save the prefixed variables to the code state.
         * The code state will be dispatched to be stored in App State's Code Action Props.
         * 
         * @NOTE: Prefixed variables will not be available to previous actions, it will only
         * be available to following actions from the current action. 
        *************************************************************************************/
        setCode((state) => ({ value, vars: prefixedVars.map((a) => a.label) }));
      }}
    />
  );
}
