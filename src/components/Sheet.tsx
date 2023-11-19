import React, { useState, useCallback } from "react";
import { VStack, HStack, Select, Button } from "@chakra-ui/react";
import Columns from "./Columns";
import DrivePicker from "./DrivePicker";

/* ************************ SHEETS REST CALLS ************************ */
const SHEETS_REST_CALLS = {
  config: {
    SPREADSHEET_ID: "1lkQxTbtOCwOjEwoS02Kx-ftkyQBHGfhhWza9hCA2Zm8",
    SHEET_NAME: "testSheet1",
    ACCESS_TOKEN:
      "ya29.a0AfB_byBTH-w86q7S5DWsj50x15BgLDENsUQh3oR8Bzr6PHVVFEnk6MfQeklj0_InZ6nLl4IEvt-qGUCsnqB76qe_lPk-sRs4-GOZEetwis3kPq0hYXJsKgi5Tjs_I4ApievpeplAOgTLJ5GHfQ8ec3cHAZnzj7WjLDYiaCgYKAfESARESFQHGX2MibbyRjuSi3cVAccfCWz8E5w0171",
  },
  updateConfig: (spreadshettId: string, sheetName: string, token: string) => {
    if (!spreadshettId || !sheetName || !token) {
      console.warn("None/Insufficient config requirements provided");
      return;
    }

    SHEETS_REST_CALLS.config.ACCESS_TOKEN = token;
    SHEETS_REST_CALLS.config.SHEET_NAME = sheetName;
    SHEETS_REST_CALLS.config.SPREADSHEET_ID = spreadshettId;
  },
  addHeaders: async (newHeaders: string[]) => {
    console.log("addHeaders called");
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_REST_CALLS.config.SPREADSHEET_ID}/values/${SHEETS_REST_CALLS.config.SHEET_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${SHEETS_REST_CALLS.config.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log({ data });
      const currentHeaders =
        data.values && data.values.length > 0 ? data.values[0] : [];

      // Check for existing headers
      let removeIndexes: number[] = [];
      newHeaders.forEach((header, index) => {
        if (currentHeaders.includes(header)) {
          removeIndexes.push(index);
        }
      });
      newHeaders = newHeaders.filter(
        (_h, index) => !removeIndexes.includes(index)
      );

      // Avoid making API call if Headers already Exists
      if (!newHeaders || newHeaders.length === 0) {
        console.warn("Headers Already Exists", newHeaders);
        return true;
      }

      // Update Headers
      const updatedHeaders = [...currentHeaders, ...newHeaders];
      const updateResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_REST_CALLS.config.SPREADSHEET_ID}/values/${SHEETS_REST_CALLS.config.SHEET_NAME}!A1:ZZ1?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${SHEETS_REST_CALLS.config.ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [updatedHeaders],
          }),
        }
      );
      const updateData = await updateResponse.json();
      console.log("Header row updated:", updateData);
    } catch (error) {
      console.error("Error adding headers:", error);
    }
  },
  addRow: async (rowData: any) => {
    try {
      // Fetch existing headers
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_REST_CALLS.config.SPREADSHEET_ID}/values/${SHEETS_REST_CALLS.config.SHEET_NAME}`,
        {
          headers: {
            Authorization: `Bearer ${SHEETS_REST_CALLS.config.ACCESS_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      const currentHeaders =
        data.values && data.values.length > 0 ? data.values[0] : [];

      // Arrange values based on headers
      const arrangedRowData = currentHeaders.map(
        (header: string) => rowData[header] || ""
      );
      console.log({ arrangedRowData });

      if (arrangedRowData.every((e: string) => e === "")) return;

      // Append the arranged row data
      const appendResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_REST_CALLS.config.SPREADSHEET_ID}/values/${SHEETS_REST_CALLS.config.SHEET_NAME}:append?valueInputOption=RAW`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SHEETS_REST_CALLS.config.ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            values: [arrangedRowData],
          }),
        }
      );

      const appendData = await appendResponse.json();
      console.log("Row added:", appendData);
    } catch (error) {
      console.error("Error adding row:", error);
    }
  },
  getSheets: async () => {
    console.log("getSheets called");
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_REST_CALLS.config.SPREADSHEET_ID}?includeGridData=false`,
        {
          headers: {
            Authorization: `Bearer ${SHEETS_REST_CALLS.config.ACCESS_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      const sheets = data.sheets.map((s: any) => ({
        id: s.properties.sheetId,
        name: s.properties.title,
      }));
      console.log({ sheets });

      return sheets;
    } catch (error) {
      console.error("Error getting sheets:", error);
    }
  },
};
/* ******************************************************************* */
type TGoogleAccounts = { email: string; accessToken: string }[];
type TChromeRuntimeTokenMsg = {
  tokenInfo: { email: string; accessToken: string }[];
};
type TPickedSheet = { name: string; id: string; url: string };

function SelectGoogleAccount({ setSelectedAccount }: any) {
  const [googleAccounts, setGoogleAccounts] = useState<TGoogleAccounts>([]);
  const getRefreshedToken = useCallback(() => {
    fetch("http://localhost:3000/refreshToken?clientId=peter")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("GoogleSheet Token: ", data);
        setGoogleAccounts((state) => [
          {
            email: data.email,
            accessToken: data.accessToken,
            ...state,
          },
        ]);
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  }, []);

  try {
    chrome.runtime.onMessage.addListener(async function (
      message: TChromeRuntimeTokenMsg
    ) {
      if (message.tokenInfo) {
        message.tokenInfo?.map((info) => {
          setGoogleAccounts((state) => [
            ...state.filter((s) => s.email !== info.email),
            {
              email: info.email,
              accessToken: info.accessToken,
            },
          ]);
        });
      }
    });
  } catch (err) {
    console.warn("Not running in Extension Context");
  }

  return (
    <VStack>
      <HStack>
        <Select
          placeholder="Select Google Account"
          onChange={(e) => {
            var selectedValue = e.target.value;
            console.log("Selected option: " + selectedValue);

            if (selectedValue === "add google account") {
              window.open(
                "http://localhost:3000/authorize?clientId=peter",
                "_blank"
              );
            } else {
              if (googleAccounts) {
                setSelectedAccount(
                  googleAccounts.filter((a) => a.email === selectedValue)[0]
                );
              }
            }
          }}
        >
          {googleAccounts &&
            googleAccounts?.map((acc) => (
              <option value={acc.email}>{acc.email}</option>
            ))}
          <option value="add google account">+ Add google account</option>
        </Select>
      </HStack>
    </VStack>
  );
}

type TColumnPairs = { id: string; label: string; value: string }[];
export default function Sheet() {
  // const options = ["preview", "Google Sheets"];
  // const [selectedOption, setSelectedOption] = useState<string>("preview");
  const [pickedSheet, setPickedSheet] = useState<TPickedSheet>();
  const [selectedAccount, setSelectedAccount] = useState<TGoogleAccounts>();
  const [pairs, setPairs] = useState<TColumnPairs>([
    { id: `${Date.now()}`, label: "", value: "" },
  ]);
  // const { getRootProps, getRadioProps } = useRadioGroup({
  //   name: "framework",
  //   defaultValue: "preview",
  //   onChange: (val) => setSelectedOption(val),
  // });

  // const group = getRootProps();

  return (
    <VStack>
      {/* <VStack alignItems="center" px={4} py={2}>
        <Box>What would you like to do with the sheet ?</Box>
        <HStack {...group}>
          {options.map((value) => {
            const radio = getRadioProps({ value });
            return (
              <RadioCard key={value} {...radio}>
                {value}
              </RadioCard>
            );
          })}
        </HStack>
      </VStack> */}

      <VStack gap={10}>
        <SelectGoogleAccount setSelectedAccount={setSelectedAccount} />

        <HStack>
          <DrivePicker
            selectedAccount={selectedAccount}
            pickedSheet={pickedSheet}
            setPickedSheet={setPickedSheet}
          />

          {pickedSheet && (
            <Button
              colorScheme="blue"
              onClick={() => window.open(pickedSheet.url, "_blank")}
            >
              Open
            </Button>
          )}
        </HStack>

        <Columns pairs={pairs} setPairs={setPairs} />
      </VStack>
    </VStack>
  );
}
