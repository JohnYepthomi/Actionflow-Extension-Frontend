import { TAppEvents } from "../Schemas/replaceTypes/StateEvents";
import React from "react";
import { useEffect, useState } from "react";
import {
  TConditionAction,
  TGeneralCondition,
  TOperatorCondition,
} from "../Schemas/replaceTypes/Actions";
import { TAction } from "../Types/ActionTypes/Action";
import { useSelector } from "@xstate/react";
import {
  Center,
  Button,
  Input,
  Select,
  Box,
  VStack,
  HStack,
  ButtonGroup,
} from "@chakra-ui/react";

type ConditionParams = {
  action: TConditionAction;
  current: any;
  dispatch: any;
  service: any;
};

export default function Conditionals({
  action,
  current,
  dispatch,
  service,
}: ConditionParams) {
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
      <ConditionItems
        action={action}
        current={current}
        dispatch={dispatch}
        service={service}
      />

      {/* Description */}
      <VStack alignItems="flex-start" w="100%" mt={2} fontSize="xs">
        <Box>Description</Box>
        <Input size={["xs", "sm"]} placeholder="Enter Description" />
      </VStack>

      {/* Operator Buttons */}
      <HStack mt={2}>
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button
            w="100%"
            colorScheme="green"
            onClick={() => handleOperatorClick("AND")}
          >
            AND
          </Button>
          <Button
            w="100%"
            colorScheme="pink"
            onClick={() => handleOperatorClick("OR")}
          >
            OR
          </Button>
        </ButtonGroup>
      </HStack>
    </>
  );
}

type ConitionItemsParams = {
  action: TConditionAction;
  current: any;
  dispatch: any;
  service: any;
};
type TSelectableConditions = TGeneralCondition | TOperatorCondition;
function ConditionItems({
  action,
  current,
  dispatch,
  service,
}: ConitionItemsParams) {
  return (
    <>
      {action &&
        action["conditions"].map((condition: TSelectableConditions, index) => (
          <Box key={index} w="100%">
            {"type" in condition ? (
              <OperatorItem selectedOperator={condition} />
            ) : (
              <Condition
                condition={condition}
                index={index}
                current={current}
                actionId={action.id}
                dispatch={dispatch}
                service={service}
              />
            )}
          </Box>
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
    <Box>
      <Center fontSize="0.7rem" sx={bg_style}>
        {selectedOperator.selected}
      </Center>
    </Box>
  );
}

const getActions = (state: any) => state.context.flowActions;

function Condition({
  condition,
  index,
  current,
  actionId,
  dispatch,
  service,
}: {
  condition: TGeneralCondition;
  index: number;
  current: any;
  actionId: string;
  dispatch: any;
  service: any;
}) {
  // const flowActions = useSelector(service, getActions);
  const [flowActions, setFlowActions] = useState(current.context.flowActions);
  const [variables, setVariables] = useState<string[]>([]);
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
        },
      },
    };
    dispatch(PAYLOAD);
  }, []);

  useEffect(() => {
    console.log("current: ", current);
    if (Array.isArray(current.context.flowActions)) {
      let newVariables: any = [
        ...current.context.flowActions
          .filter((c: TAction) => "props" in c && c?.props?.variable)
          .map((c: TAction) => {
            if ("props" in c && c?.props?.variable) {
              return "$" + c?.props?.variable; // adding '$' for now, this should be added form the action component itself
            }
          }),
        ...[].concat(
          ...current.context.flowActions
            .filter((c: TAction) => "props" in c && c?.props?.vars)
            .map((c: TAction) => {
              if ("props" in c && c?.props?.vars) {
                return c?.props?.vars;
              }
            })
        ),
      ];

      if (newVariables) {
        console.log({ newVariables });
        setVariables(newVariables);
      }
    }
  }, [current]);

  return (
    <VStack key={index} alignItems="flex-start" w="100%" fontSize="xs">
      {condition?.selectedType &&
        ["Basic", "Text", "Number"].includes(condition?.selectedType) && (
          <VStack mt={2} w="100%" alignItems="flex-start">
            <Box>Vairables</Box>
            <Select
              onChange={handleVariableChange}
              disabled={!variables}
              size={["xs", "sm"]}
            >
              {variables &&
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
                  );
                })}
            </Select>
          </VStack>
        )}

      <VStack mt={2} w="100%" alignItems="flex-start">
        <Box>{condition.selectedType}</Box>

        <Select onChange={handleConditionOptionChange} size={["xs", "sm"]}>
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
        </Select>
      </VStack>

      {condition.requiresCheck && (
        <Input
          className="w-100"
          placeholder="asd"
          type="text"
          onChange={handleConditionValueChange}
          size={["xs", "sm"]}
        />
      )}
    </VStack>
  );
}
