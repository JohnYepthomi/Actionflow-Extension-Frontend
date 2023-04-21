import "../styles/conditionals.css";

export default function Conditionals({
  conditionType,
  actions,
  actionId,
  dispatch,
}) {
  const defaultConditionOption = {
    selectedType: "Element",
    selectedOption: "IsVisible",
    requiresCheck: true,
    checkValue: null,
  };

  function handleOperatorClick(conditionType, operator, actionId) {
    if (conditionType === "IF") {
      const prevConditions = actions.filter(({ id }) => id === actionId)[0][
        "conditions"
      ];
      const updatedConditions = [
        ...prevConditions,
        { type: "Operator", value: operator },
        defaultConditionOption,
      ];

      dispatch({ type: "ADD_CONDITION_OPERATOR", actionId, updatedConditions });
    }
  }

  return (
    <div className="action-details flex-column p-2">
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
          onClick={() => handleOperatorClick(conditionType, "AND", actionId)}
        >
          + AND
        </button>
        <button
          className="flex-1"
          onClick={() => handleOperatorClick(conditionType, "OR", actionId)}
        >
          + OR
        </button>
      </div>
    </div>
  );
}

function OperatorItem({ selectedOperator }) {
  const bg_clr = selectedOperator.value === "AND" ? "#368136" : "#a739a7";
  const bg_style = { backgroundColor: bg_clr };
  return (
    <div className="flex-row align-center justify-center mt-1 mb-1">
      <div
        className="operator-view-inner flex-row align-center justify-center"
        style={bg_style}
      >
        {selectedOperator.value}
      </div>
    </div>
  );
}

function Condition({ condition, index, actionId, dispatch }) {
  const AllConditions = [
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
        "does not contain",
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
            const { value } = event.target.selectedOptions;
            const conditionType =
              event.target.selectedOptions[0].getAttribute("conditionType");
            const requiresCheck = JSON.parse(
              event.target.selectedOptions[0].getAttribute("requiresCheck")
            );

            dispatch({
              type: "UPDATE_CONDITION",
              actionId,
              index,
              selection: { value, conditionType, requiresCheck },
            });
          }}
        >
          {AllConditions &&
            AllConditions.map((cond) => {
              return (
                <optgroup label={cond.type}>
                  {cond.options &&
                    cond.options.map((value) => (
                      <option
                        value={value}
                        conditionType={cond.type}
                        requiresCheck={JSON.stringify(cond.requiresCheck)}
                        selected={
                          value === condition.selectedOption ? "selected" : ""
                        }
                      >
                        {value}
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
            <>
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
            </>
          ))}
    </>
  );
}
