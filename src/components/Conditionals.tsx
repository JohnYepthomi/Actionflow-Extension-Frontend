import { TAppEvents } from "../Schemas/replaceTypes/StateEvents";
import React from "react";
import { useEffect, useState } from 'react';
import {
  TConditionAction,
  TGeneralCondition,
  TOperatorCondition,
} from "../Schemas/replaceTypes/Actions";
import { TAction } from "../Types/ActionTypes/Action";

type ConditionParams = {
  action: TConditionAction;
  current: any;
  dispatch: any;
};

export default function Conditionals({ action, current, dispatch }: ConditionParams) {
  const handleOperatorClick = React.useCallback((operator: "AND" | "OR") => {
    const PAYLOAD: TAppEvents = {
      type: "ADD_OPERATOR",
      payload: {
        actionId: action.id,
        selection: operator,
      },
    };
    dispatch(PAYLOAD);
  }, []);

  return (
    <>
      <ConditionItems action={action} current={current} dispatch={dispatch} />

      {/* Description */}
      <div className="flex-row align-center justify-center flex-1 mt">
        <div className="fs-sm">Description</div>
        <input className="flex-1" type="text" placeholder="Enter Description" />
      </div>

      {/* Operator Buttons */}
      <div className="flex-row align-center justify-center mt">
        <button className="flex-1" onClick={() => handleOperatorClick("AND")}>
          + AND
        </button>
        <button className="flex-1" onClick={() => handleOperatorClick("OR")}>
          + OR
        </button>
      </div>
    </>
  );
}

type ConitionItemsParams = {
  action: TConditionAction;
  current: any;
  dispatch: any;
};
type TSelectableConditions = TGeneralCondition | TOperatorCondition;
function ConditionItems({ action, current, dispatch }: ConitionItemsParams) {
  return (
    <>
      {action &&
        action["conditions"].map((condition: TSelectableConditions, index) => (
          <div key={index}>
            {"type" in condition ? (
              <OperatorItem selectedOperator={condition} />
            ) : (
              <Condition
                condition={condition}
                index={index}
                current={current}
                actionId={action.id}
                dispatch={dispatch}
              />
            )}
          </div>
        ))}
    </>
  );
}

type TOperatorParams = {
  selectedOperator: TOperatorCondition;
};
function OperatorItem({ selectedOperator }: TOperatorParams) {
  const bg_clr = selectedOperator.selected === "AND" ? "#368136" : "#a739a7";
  const bg_style = { backgroundColor: bg_clr };
  return (
    <div className="flex-row align-center justify-center mt-1 mb-1">
      <div
        className="operator-view-inner flex-row align-center justify-center"
        style={bg_style}
      >
        {selectedOperator.selected}
      </div>
    </div>
  );
}

function Condition({
  condition,
  index,
  current,
  actionId,
  dispatch,
}: {
  condition: TGeneralCondition;
  index: number;
  current: any;
  actionId: string;
  dispatch: any;
}) {

  const [variables, setVariables] = useState<string[]|undefined>(["test", "my-texts"]);

  const ConditionsOptionsTemplate: {
    type: "Basic" | "Element" | "Text" | "Number";
    options: string[];
    requiresCheck?: Boolean;
  }[] = [
    {
      type: "Basic",
      options: ["IsEmpty", "IsNotEmpty"],
      requiresCheck: true,
    },
    {
      type: "Element",
      options: ["IsHidden", "IsVisible"],
      requiresCheck: true,
    },
    {
      type: "Text",
      options: [
        "Contains",
        "NotContains",
        "IsExactly",
        "StartsWith",
        "EndsWith",
      ],
      requiresCheck: true,
    },
    {
      type: "Number",
      options: [
        "GreaterThan",
        "GreaterThanEqualTo",
        "LessThan",
        "LessThanEqualTo",
        "IsEqualTo",
        "IsNotEqualTo",
      ],
      requiresCheck: true,
    },
  ];

  const handleConditionOptionChange = React.useCallback((event: any) => {
    const selected_condition_value = event.target.value;
    const selectedOption = event.target.selectedOptions[0].getAttribute(
      "data-selected-option"
    );
    const selectedType = ConditionsOptionsTemplate.filter((cot) =>
      cot.options.includes(selectedOption)
    )[0].type;

    const PAYLOAD: TAppEvents = {
      type: "UPDATE_CONDITION",
      payload: {
        actionId,
        index,
        selection: {
          value: selected_condition_value,
          selectedType,
          selectedOption,
        },
      },
    };

    dispatch(PAYLOAD);
  }, []);

  const handleConditionValueChange = React.useCallback((event: any) => {
    const PAYLOAD: TAppEvents = {
      type: "UPDATE_CONDITION",
      payload: {
        index,
        actionId,
        checkValue: event.target.value,
      },
    };
    dispatch(PAYLOAD);
  }, []);

  const handleVariableChange = React.useCallback((event: any) => {
    const PAYLOAD: TAppEvents = {
      type: "UPDATE_CONDITION",
      payload: {
        index,
        actionId,
        selection: {
          selectedVariable: event.target.value,
        }
      },
    };
    dispatch(PAYLOAD);
  }, [variables])

  useEffect(()=>{
    if(Array.isArray(current.flowActions)){
      let variables = current.flowActions.filter((c: TAction) => "props" in c && c?.props?.variable).map((c: TAction) => "props" in c && c?.props?.variable);
      if(variables)
       setVariables(variables);
    }
  },[current.flowActions])

  return (
    <div key={index} className="condition-container p-2">

      {
        condition?.selectedType && !["Element", "Code"].includes(condition?.selectedType) && 
        <select onChange={handleVariableChange} disabled={!variables}>
          <optgroup label="Variables">
          {
            variables &&
            variables.map((varb, index) => {
              return (
                <option
                  key={index}
                  value={varb}
                  data-selected-option={varb}
                  // data-requires-check={JSON.stringify(
                  //   varb.requiresCheck
                  // )}
                  selected={
                    varb === condition?.selectedVariable ? true : false
                  }
                >
                  {varb}
                </option>
            )})
          }
          </optgroup>
        </select>
      }


      <div className="flex-row align-center mt">
        <div className="fs-sm">{condition.selectedType}</div>
        
        <select onChange={handleConditionOptionChange}>
          {ConditionsOptionsTemplate &&
            ConditionsOptionsTemplate.map((cond_opts, index) => {
              return (
                <optgroup key={index} label={cond_opts.type}>
                  {cond_opts.options &&
                    cond_opts.options.map((option, optIndex) => (
                      <option
                        key={optIndex}
                        value={option}
                        data-selected-option={option}
                        // data-requires-check={JSON.stringify(
                        //   cond_opts.requiresCheck
                        // )}
                        selected={
                          option === condition.selectedOption ? true : false
                        }
                      >
                        {option}
                      </option>
                    ))}
                </optgroup>
              );
            })}
        </select>
      </div>

      <div className="flex-1 mt">
        {condition.requiresCheck && (
          <input
            className="w-100"
            type="text"
            onChange={handleConditionValueChange}
          />
        )}
      </div>
    </div>
  );
}
