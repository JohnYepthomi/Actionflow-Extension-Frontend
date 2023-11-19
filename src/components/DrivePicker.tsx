import { useEffect, useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { Select } from "@chakra-ui/react";

export default function DrivePicker({
  selectedAccount,
  pickedSheet,
  setPickedSheet,
}: any) {
  const [openPicker, authResponse] = useDrivePicker();
  const [token, setToken] = useState<string>(selectedAccount);

  /**
   * Creating a new access_token on the client side requires a clientId, an API key and all the required scopes.
   *
   * If you have an access_token, you only need an API key and you do not need to specify the client Id and customScopes.
   * All required Scopes have already been assigned to an access_token when the token was created.
   */

  useEffect(() => {
    if (selectedAccount) {
      setToken(selectedAccount);
    }
  }, [selectedAccount]);

  const handleOpenPicker = () => {
    openPicker({
      clientId: "",
      developerKey: "AIzaSyDJ67VZ4SCwFL5kpTy0_lh2XV2FOxvsZ-k",
      viewId: "SPREADSHEETS",
      token:
        token ??
        "ya29.a0AfB_byDCv8hdBnPIMGETKZjekLYiOv4N0e9GnxOGVKMYZ-5eeL_ttCZFMPCb7G0gJU3xysZKn7EAWovx5doIJqeddY7NIJB-fPuzht6hIxT9UADrvzuyLd1b3zoTrae8TmN8Q_HTROTRuSNH0KIYY039WL4b_2HCnccPaCgYKAVsSARESFQHGX2Mi_CgGjx90gIZ5rvV6omCxtQ0171",
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: false,
      multiselect: false,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }

        console.log(data.docs);

        if (data?.docs[0]?.name && data?.docs[0]?.url) {
          console.log("data?.docs[0]?.name: ", data?.docs[0]?.name);
          setPickedSheet({
            name: data.docs[0].name,
            id: data.docs[0].id,
            url: data.docs[0].url,
          });
        } else {
          console.error("Spreadsheet name or url missing.");
        }
      },
    });
  };

  return (
    <Select
      placeholder="Select Spreadsheet"
      onChange={(e) => {
        var selectedValue = e.target.value;
        console.log("Selected option: " + selectedValue);
        if (selectedValue === "View all Spreadsheets") {
          handleOpenPicker();
        }
      }}
    >
      {pickedSheet && (
        <option value={pickedSheet.name} selected>
          {pickedSheet.name}
        </option>
      )}
      <option value="View all Spreadsheets">View all Spreadsheets</option>
    </Select>
  );
}
