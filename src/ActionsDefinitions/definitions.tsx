import GlobeIcon from "../assets/globe";
import { z } from "zod";
import { IntActionTypesSchema } from "../Schemas/InteractionsSchema";
import {
  FaArrowPointer,
  FaRegKeyboard,
  FaArrowsUpToLine,
  FaWindowMaximize,
  FaWindowRestore,
} from "react-icons/fa6";
import {
  BsBodyText,
  BsWindowDash,
  BsCloudUploadFill,
  BsCalendar2Date,
  BsFillFileCodeFill,
} from "react-icons/bs";
import { CgScrollV } from "react-icons/cg";
import { TiFlowMerge } from "react-icons/ti";
import { IoIosWarning } from "react-icons/io";
import { TbSelector } from "react-icons/tb";
import { HiLink } from "react-icons/hi";

export const InteractionDefinitions = [
  {
    svg: () => <FaRegKeyboard />,
    name: "Type",
  },
  {
    svg: () => <FaArrowPointer />,
    name: "Click",
  },
  {
    svg: () => <CgScrollV size={18} />,
    name: "Scroll",
  },
  {
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        className="bi bi-arrow-up-left-square"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm10.096 8.803a.5.5 0 1 0 .707-.707L6.707 6h2.768a.5.5 0 1 0 0-1H5.5a.5.5 0 0 0-.5.5v3.975a.5.5 0 0 0 1 0V6.707l4.096 4.096z"
        />
      </svg>
    ),
    name: "Hover",
  },
  {
    svg: () => <IoIosWarning />,
    name: "Prompts",
  },
  {
    svg: () => <TbSelector />,
    name: "Select",
  },
  {
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        className="bi bi-keyboard"
        viewBox="0 0 16 16"
      >
        <path d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z" />
        <path d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z" />
      </svg>
    ),
    name: "Keypress",
  },
  {
    svg: () => <BsCalendar2Date />,
    name: "Date",
  },
  {
    svg: () => <BsCloudUploadFill />,
    name: "Upload",
  },
  {
    svg: () => <BsFillFileCodeFill />,
    name: "Code",
  },
  {
    name: "IF",
    svg: () => <TiFlowMerge />,
  },
  {
    name: "END",
    svg: () => <FaArrowsUpToLine />,
  },
  {
    name: "NewTab",
    svg: () => <FaWindowMaximize />,
  },
  {
    name: "SelectTab",
    svg: () => <FaWindowRestore />,
  },
  {
    name: "CloseTab",
    svg: () => <BsWindowDash />,
  },
  {
    name: "Navigate",
    svg: GlobeIcon,
  },
  {
    name: "List",
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        className="bi bi-list-stars"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
        />
        <path d="M2.242 2.194a.27.27 0 0 1 .516 0l.162.53c.035.115.14.194.258.194h.551c.259 0 .37.333.164.493l-.468.363a.277.277 0 0 0-.094.3l.173.569c.078.256-.213.462-.423.3l-.417-.324a.267.267 0 0 0-.328 0l-.417.323c-.21.163-.5-.043-.423-.299l.173-.57a.277.277 0 0 0-.094-.299l-.468-.363c-.206-.16-.095-.493.164-.493h.55a.271.271 0 0 0 .259-.194l.162-.53zm0 4a.27.27 0 0 1 .516 0l.162.53c.035.115.14.194.258.194h.551c.259 0 .37.333.164.493l-.468.363a.277.277 0 0 0-.094.3l.173.569c.078.255-.213.462-.423.3l-.417-.324a.267.267 0 0 0-.328 0l-.417.323c-.21.163-.5-.043-.423-.299l.173-.57a.277.277 0 0 0-.094-.299l-.468-.363c-.206-.16-.095-.493.164-.493h.55a.271.271 0 0 0 .259-.194l.162-.53zm0 4a.27.27 0 0 1 .516 0l.162.53c.035.115.14.194.258.194h.551c.259 0 .37.333.164.493l-.468.363a.277.277 0 0 0-.094.3l.173.569c.078.255-.213.462-.423.3l-.417-.324a.267.267 0 0 0-.328 0l-.417.323c-.21.163-.5-.043-.423-.299l.173-.57a.277.277 0 0 0-.094-.299l-.468-.363c-.206-.16-.095-.493.164-.493h.55a.271.271 0 0 0 .259-.194l.162-.53z" />
      </svg>
    ),
  },
  {
    name: "Text",
    svg: () => <BsBodyText />,
  },
  {
    name: "Attribute",
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        className="bi bi-hash"
        viewBox="0 0 16 16"
      >
        <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z" />
      </svg>
    ),
  },
  {
    name: "Anchor",
    svg: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="currentColor"
        className="bi bi-window-stack"
        viewBox="0 0 16 16"
      >
        <path d="M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM6 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
        <path d="M12 1a2 2 0 0 1 2 2 2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10ZM2 12V5a2 2 0 0 1 2-2h9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1Zm1-4v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8H3Zm12-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2h12Z" />
      </svg>
    ),
  },
  {
    name: "URL",
    svg: () => <HiLink />,
  },
];

export const ActionNodeProps = {
  get: <T extends z.infer<typeof IntActionTypesSchema>>(actionName: T) => {
    if (!["URL", "Common", "Tab", "Code"].includes(actionName))
      return {
        ...ActionNodeProps["Common"],
        ...ActionNodeProps[`${actionName}`]!,
      };
  },
  Common: {
    nodeName: "",
    selector: "",
  },
  Type: {
    Text: "",
    "Overwrite Existing Text": false,
  },
  Click: {
    "Wait For New Page To Load": false,
    "Wait For File Download": false,
    Description: "",
  },
  Scroll: {
    Direction: ["Top", "Bottom"],
    Description: "",
  },
  Hover: {
    Description: "",
  },
  Prompts: {
    "Response Type": {
      Accept: false,
      Decline: false,
    },
    "Response Text": "",
  },
  Select: {
    Selected: "",
    Options: [""],
    Description: "",
  },
  Keypress: {
    Key: "",
    "Wait For Page To Load": false,
  },
  Date: {
    Date: "",
  },
  Upload: {
    Path: "",
  },
  Code: {
    Code: "",
  },
  List: {
    variable: "",
  },
  Text: {
    variable: "",
    value: "",
  },
  Attribute: {
    variable: "",
    attribute: "",
    value: "",
  },
  Anchor: {
    variable: "",
    value: "",
  },
  URL: {
    variable: "",
    value: "",
  },
  Tab: {
    url: "",
    tabId: undefined,
    windowId: undefined,
  },
};
