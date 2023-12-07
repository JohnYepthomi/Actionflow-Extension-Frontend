import { theme as chakraTheme } from "@chakra-ui/theme";
import { extendTheme } from "@chakra-ui/react";

// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 3. extend the theme

// theme.styles.global["*, *::before, &::after"];

const theme = extendTheme({
  ...chakraTheme,
  styles: {
    global: {
      body: {
        bg: "rgba(40,40,40)",
      },
      "input:focus": {
        borderColor: "orange !important",
        boxShadow: "0 0 3.5px orange !important",
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          backgroundColor: "whiteAlpha.50",
        },
      },
    },
    Button: {
      baseStyle: {
        _hover: {
          _disabled: {
            bg: "red",
          },
        },
      },
      variants: {
        brand: {
          bg: "orange.600",
          color: "white",
          _hover: {
            bg: "blue.600",
          },
        },
        secondary: {
          bg: "gray.500",
          color: "white",
          _hover: {
            bg: "gray.600",
          },
        },
      },
    },
    Input: {
      baseStyle: {
        borderRadius: "8px",
        _focus: {
          borderColor: "orange !important",
        },
      },
    },
    Modal: {
      baseStyle: {
        backgroundColor: "rgb(35,35,35)",
        dialog: {
          bg: "rgb(30,30,30)",
          color: "white",
        },
        header: {
          fontSize: "sm",
          fontWeight: "bold",
        },
        body: {
          padding: "1rem",
        },
        footer: {
          padding: "1rem",
        },
      },
    },
  },
  config,
});

console.log({ theme });

export default theme;
