export default function Conditionals({
  conditionType,
  actions,
  actionId,
  dispatch,
}) {
  const GeneralConditionDefaultTemplate = {
    selectedType: "Element",
    selectedOption: "IsVisible",
    requiresCheck: true,
    checkValue: "",
  };

  function handleOperator(conditionType, operator, actionId) {
    dispatch({ type: "ADD_CONDITION_OPERATOR", actionId, selection: operator });
  }

  return (
    <>
      <ConditionItems
        actions={actions}
        actionId={actionId}
        dispatch={dispatch}
      />

      {/* Description */}
      <div className="flex-row align-center justify-center flex-1 mt">
        <div className="fs-sm">Description</div>
        <input className="flex-1" type="text" placeholder="Enter Description" />
      </div>

      {/* Operator Buttons */}
      <div className="flex-row align-center justify-center mt">
        <button
          className="flex-1"
          onClick={() => handleOperator(conditionType, "AND", actionId)}
        >
          {" "}
          + AND{" "}
        </button>
        <button
          className="flex-1"
          onClick={() => handleOperator(conditionType, "OR", actionId)}
        >
          {" "}
          + OR{" "}
        </button>
      </div>
    </>
  );
}

function OperatorItem({ selectedOperator }) {
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

type TConditionsOptionsTemplate = {
  type: string;
  options: string[];
  requiresCheck?: Boolean;
};

function Condition({ condition, index, actionId, dispatch }) {
  const ConditionsOptionsTemplate: TConditionsOptionsTemplate[] = [
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

  return (
    <div key={index} className="condition-container p-2">
      <div className="flex-row align-center">
        <div className="fs-sm">{condition.selectedType}</div>
        <select
          onChange={(event) => {
            const selected_condition_value = event.target.value;
            const selectedOption = event.target.selectedOptions[0].getAttribute("data-selected-option");
            const requiresCheck = JSON.parse(event.target.selectedOptions[0].getAttribute("data-requires-check"));
            const conditionType = ConditionsOptionsTemplate.filter((cot) => cot.options.includes(selectedOption))[0].type;

            dispatch({
              type: "UPDATE_CONDITION",
              actionId,
              index,
              selection: {
                value: selected_condition_value,
                conditionType,
                selectedOption,
                requiresCheck,
              },
            });
          }}
        >
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
                        data-requires-check={JSON.stringify(
                          cond_opts.requiresCheck
                        )}
                        selected={
                          option === condition.selectedOption ? true : false
                        }
                      >
                        {" "}
                        {option}{" "}
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
            onChange={(event) => {
              dispatch({
                type: "UPDATE_CONDITION",
                actionId,
                index,
                checkValue: event.target.value,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}

function ConditionItems({ actions, actionId, dispatch }) {
  return (
    <>
      {actions &&
        actions
          .filter(({ id }) => id === actionId)[0]
          ["conditions"].map((condition, index) => (
            <div key={index}>
              {condition.type === "Operator" ? (
                <OperatorItem selectedOperator={condition} />
              ) : (
                <Condition
                  condition={condition}
                  index={index}
                  actionId={actionId}
                  dispatch={dispatch}
                />
              )}
            </div>
          ))}
    </>
  );
}
