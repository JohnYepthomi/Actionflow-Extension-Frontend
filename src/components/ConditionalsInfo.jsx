import "../styles/conditionals.css";
import { useEffect, useState } from "react";

function OperatorItem({ operatorCondition }) {
  return (
    <div className="flex-row align-center justify-center mt-1 mb-1">
      <div
        className="operator-view-inner flex-row align-center justify-center"
        style={{
          backgroundColor: `${
            operatorCondition.value === "AND" ? "#368136" : "#a739a7"
          }`,
          width: "50px",
          borderRadius: "3px",
          fontSize: "0.59rem",
          fontWeight: "bold",
          padding: "2px",
          border: "2px solid rgb(40, 37, 37)",
        }}
      >
        {operatorCondition.value}
      </div>
    </div>
  );
}

function ConditionItem({ actions, actionId }) {
  const [selectedOption, setSelectedOption] = useState();

  useEffect(() => {
    console.log("ConditionalItem");
  }, []);

  return (
    <>
      {actions &&
        actions
          .filter((a) => a.id === actionId)[0]
          ["conditions"].map((condition, index) => (
            <>
              {condition.type === "Operator" && (
                <OperatorItem operatorCondition={condition} />
              )}

              {condition.type !== "Operator" && (
                <div
                  key={condition + index}
                  style={{
                    backgroundColor: "#282525",
                    padding: "10px",
                    borderRadius: "3px",
                  }}
                >
                  <div className="flex-row align-center">
                    <div className="fs-sm">Condition</div>
                    <select onChange={(option) => setSelectedOption(option)}>
                      {condition && (
                        <optgroup label={condition.type} selected="selected">
                          {condition.options &&
                            condition.options.map((value) => (
                              <option value="saab">{value}</option>
                            ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div className="flex-1 mt">
                    {selectedOption && <input className="w-100" type="text" />}
                  </div>
                </div>
              )}
            </>
          ))}
    </>
  );
}

export default function ConditionalsInfo({
  conditionType,
  setActions,
  actions,
  actionId,
}) {

  const ConditionOptions = {
    type: "Element",
    options: ["IsHidden", "IsVisible"],
  };
  function handleOperatorClick(conditionType, operator, actionId) {
    if (conditionType === "IF") {
      const updatedConditions = [
        ...actions.filter((a) => a.id === actionId)[0]["conditions"],
        { type: "Operator", value: operator },
        ConditionOptions,
      ];

      setActions((prevstate) => {
        return prevstate.map((action) => {
          if (action.id === actionId) {
            return { ...action, conditions: updatedConditions };
          }

          return action;
        });
      });
    }
  }

  useEffect(() => {
    console.log("ConditionalsInfo");
  }, []);

  return (
    <div className="action-details flex-column padding-all">
      <ConditionItem actions={actions} actionId={actionId} />

      <div className="flex-row align-center justify-center flex-1 mt">
        <div className="fs-sm">Description</div>
        <input className="flex-1" type="text" placeholder="Enter Description" />
      </div>

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
