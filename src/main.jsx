import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { IconContext } from "react-icons";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme} mode="dark">
      <IconContext.Provider
        value={{
          size: "16px",
          color: "white",
          className: "global-class-name",
        }}
      >
        <App />
      </IconContext.Provider>
    </ChakraProvider>
  </React.StrictMode>
);
