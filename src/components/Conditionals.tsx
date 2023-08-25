import {
  ConditionalAction,
  GeneralCondition,
  OperatorCondition,
  SelectableConditions,
} from "../Types/ActionTypes/Conditional Actions";
import { TEvtWithProps } from "../Types/State Types/StateEvents";
import React from "react";

export default function Conditionals({
  action,
  dispatch,
}: {
  action: ConditionalAction;
  dispatch: any;
}) {
  const handleOperatorClick = React.useCallback((operator: "AND" | "OR") => {
    const PAYLOAD: TEvtWithProps = {
      type: "ADD_CONDITION_OPERATOR",
      actionId: action.id,
      selection: operator,
    };
    dispatch(PAYLOAD);
  }, []);

  return (
    <>
      <ConditionItems action={action} dispatch={dispatch} />

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

function ConditionItems({
  action,
  dispatch,
}: {
  action: ConditionalAction;
  dispatch: any;
}) {
  return (
    <>
      {action &&
        action["conditions"].map((condition: SelectableConditions, index) => (
          <div key={index}>
            {"type" in condition ? (
              <OperatorItem selectedOperator={condition} />
            ) : (
              <Condition
                condition={condition}
                index={index}
                actionId={action.id}
                dispatch={dispatch}
              />
            )}
          </div>
        ))}
    </>
  );
}

function OperatorItem({
  selectedOperator,
}: {
  selectedOperator: OperatorCondition;
}) {
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
  actionId,
  dispatch,
}: {
  condition: GeneralCondition;
  index: number;
  actionId: string;
  dispatch: any;
}) {
  const ConditionsOptionsTemplate: {
    type: string;
    options: string[];
    requiresCheck?: Boolean;
  }[] = [
    {
      type: "Basic",
      options: ["is empty", "is not empty"],
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
        "contains",
        "Does not contain",
        "is exactly",
        "starts with",
        "ends with",
      ],
      requiresCheck: true,
    },
    {
      type: "Number",
      options: [
        "greater than",
        "greater than or equal to",
        "less than",
        "less than or equal to",
        "equal to",
        "not equal to",
      ],
      requiresCheck: true,
    },
  ];

  const handleConditionOptionChange = React.useCallback((event) => {
    const selected_condition_value = event.target.value;
    const selectedOption = event.target.selectedOptions[0].getAttribute(
      "data-selected-option"
    );
    const conditionType = ConditionsOptionsTemplate.filter((cot) =>
      cot.options.includes(selectedOption)
    )[0].type;

    const PAYLOAD: TEvtWithProps = {
      type: "UPDATE_CONDITION",
      payload: {
        actionId,
        index,
        selection: {
          value: selected_condition_value,
          conditionType,
          selectedOption,
        },
      },
    };

    dispatch(PAYLOAD);
  }, []);

  const handleConditionValueChange = React.useCallback((event) => {
    const PAYLOAD: TEvtWithProps = {
      type: "UPDATE_CONDITION",
      payload: {
        index,
        actionId,
        checkValue: event.target.value,
      },
    };
    dispatch(PAYLOAD);
  }, []);

  return (
    <div key={index} className="condition-container p-2">
      <div className="flex-row align-center">
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
