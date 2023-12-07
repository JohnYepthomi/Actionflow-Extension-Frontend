import React, { createContext } from "react";
import { useInterpret } from "@xstate/react";
import { AppStateMachine } from "./state";

export const GlobalStateContext = createContext({});

export const GlobalStateProvider = (props) => {
  console.log({ AppStateMachine });
  const appService = useInterpret(AppStateMachine);

  return (
    <GlobalStateContext.Provider value={{ appService }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
};
