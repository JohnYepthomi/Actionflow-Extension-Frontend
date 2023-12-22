import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Edge,
    EdgeChange,
    Handle,
    MiniMap,
    Node,
    NodeChange,
    Panel,
    Position,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    useEdgesState,
    useNodesState,
    useOnSelectionChange,
    ReactFlowProvider,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TAction } from "../../Schemas/replaceTypes/Actions";
import ActionHeader from "../WorkflowActions/ActionHeader";
import { motion } from 'framer-motion';
import ActionEdge from "./ActionEdge";
import ActionNode from "./ActionNode";
import { EvaluateNesting } from "../../AppState/state";
// import ActionDetails from "../WorkflowActions/ActionDetails";

const proOptions = { hideAttribution: true };
const handleStyle = { left: 10 };

const nodeType = { actionNode: ActionNode };
const edgeType = { actionEdge: ActionEdge };

const PerformanceLogger = {
    enabled: false,    
    t0: 0,
    t1: 0,
    start: function(id){
        if(!this.enabled)
            return;

        this.t0 = performance.now();
    },
    stop: function(id){
        if(!this.enabled)
            return;

        this.t1 = performance.now();
        console.log(`%c ${id} -> ${this.t1 - this.t0}ms`, `color: skyblue;`);
    }
};

// let BrowserActions: any = [
//     {
//         "id": "3d715f69-8854-2bb2-424c-d7a6ee8c6aef",
//         "recorded": true,
//         "nestingLevel": 0,
//         "actionType": "NewTab",
//         "props": {
//             "url": "https://www.google.com/",
//             "tabId": 1010964838,
//             "windowId": 1010964740
//         },
//         "marginLeft": 0
//     },
//     {
//         "id": "73209e8b-c84e-ba5f-e468-44fd08a79bea",
//         "recorded": true,
//         "nestingLevel": 0,
//         "actionType": "Click",
//         "props": {
//             "nodeName": "TEXTAREA",
//             "selector": "textarea[aria-label=\"Search\"]",
//             "Wait For New Page To Load": false,
//             "Wait For File Download": false,
//             "Description": "Search"
//         },
//         "marginLeft": 0
//     },
//     {
//         "id": "87368a6d-3dc0-65d4-dce3-47d51370b97d",
//         "recorded": true,
//         "nestingLevel": 0,
//         "actionType": "Type",
//         "props": {
//             "nodeName": "TEXTAREA",
//             "selector": "textarea[aria-label=\"Search\"]",
//             "Text": "ds",
//             "Overwrite Existing Text": false
//         },
//         "marginLeft": 0
//     },
//     {
//         "id": "84553a11-61a2-968d-810d-d14481d10708",
//         "actionType": "IF",
//         "nestingLevel": 0,
//         "conditions": [
//             {
//                 "selectedVariable": "",
//                 "selectedType": "Element",
//                 "selectedOption": "IsVisible",
//                 "requiresCheck": true,
//                 "checkValue": ""
//             }
//         ],
//         "marginLeft": 0
//     },
//     {
//         "id": "c3535d45-c937-5ac6-65b2-a031f5541ec4",
//         "actionType": "Date",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Date": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "b3ea49c3-0a41-7471-12ce-b1e0f36079c2",
//         "actionType": "Prompts",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Response Type": {
//                 "Accept": false,
//                 "Decline": false
//             },
//             "Response Text": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "1d4bbaf5-9a13-967c-345c-167f2301c015",
//         "actionType": "END",
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "9041e57c-d5f6-5cfb-e0af-cae119dc7176",
//         "actionType": "IF",
//         "nestingLevel": 0,
//         "conditions": [
//             {
//                 "selectedVariable": "",
//                 "selectedType": "Element",
//                 "selectedOption": "IsVisible",
//                 "requiresCheck": true,
//                 "checkValue": ""
//             }
//         ],
//         "marginLeft": 0
//     },
//     {
//         "id": "97533601-576b-897f-7ce5-8c9a9947553d",
//         "actionType": "Text",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "variable": "",
//             "value": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "6c867c7b-c4f9-744d-e4b3-16edaae6d14e",
//         "actionType": "Date",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Date": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "5f5763dd-d699-c197-1ad2-ea0ac5ff5aab",
//         "actionType": "END",
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "d9b30cf9-252f-df53-dd49-d57db6b2cce7",
//         "actionType": "List",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "variable": ""
//         },
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "1d00f324-64f6-1fb4-a453-ec5c2a72a9eb",
//         "actionType": "Upload",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Path": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "2a625314-e61a-5517-39e7-1b6b85790e03",
//         "actionType": "Select",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Selected": "",
//             "Options": [
//                 ""
//             ],
//             "Description": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "bff72c4f-6e60-e737-543f-a7f487ca3403",
//         "actionType": "Prompts",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "Response Type": {
//                 "Accept": false,
//                 "Decline": false
//             },
//             "Response Text": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "70c09334-405d-a025-cf13-5c2b76af3747",
//         "actionType": "URL",
//         "recorded": false,
//         "props": {
//             "nodeName": "",
//             "selector": "",
//             "variable": "",
//             "value": ""
//         },
//         "nestingLevel": 1,
//         "marginLeft": 20
//     },
//     {
//         "id": "14378a80-4867-e40d-e183-82096d343b65",
//         "actionType": "END",
//         "nestingLevel": 0,
//         "marginLeft": 0
//     },
//     {
//         "id": "d34becdf-f761-f6d9-1996-1155832ea399",
//         "actionType": "IF",
//         "nestingLevel": 0,
//         "conditions": [
//             {
//                 "selectedVariable": "",
//                 "selectedType": "Element",
//                 "selectedOption": "IsVisible",
//                 "requiresCheck": true,
//                 "checkValue": ""
//             }
//         ],
//         "marginLeft": 0
//     }
// ]

let BrowserActions: any = [
    {
        "id": "4bbe0691-252b-f4b9-dde2-d04553691346",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "INPUT",
            "selector": "input[aria-label=\"Find a repository…\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Find a repository…"
        },
        "marginLeft": 0
    },
    {
        "id": "17341719-2c9b-1c25-c0de-d1219915c1ba",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "H2",
            "selector": "nav > h2",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Repositories"
        },
        "marginLeft": 0
    },
    {
        "id": "db1bb119-4dad-5320-7954-c65228f95b31",
        "recorded": true,
        "nestingLevel": 0,
        "actionType": "Click",
        "props": {
            "nodeName": "path",
            "selector": "button[aria-label=\"Search or jump to…\"]",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": ""
        },
        "marginLeft": 0
    },
    {
        "id": "7251e9aa-937e-d0d1-3039-20494f39715a",
        "actionType": "IF",
        "nestingLevel": 0,
        "conditions": [
            {
                "selectedVariable": "",
                "selectedType": "Element",
                "selectedOption": "IsVisible",
                "requiresCheck": true,
                "checkValue": ""
            }
        ],
        "marginLeft": 0
    },
    {
        "id": "86b4bc14-daf5-3896-07cc-933bfecc5639",
        "actionType": "List",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "4231b4b4-623a-9742-705a-eba54a100ac2",
        "actionType": "Text",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": "",
            "value": ""
        },
        "nestingLevel": 2,
        "marginLeft": 40
    },
    {
        "id": "ad2dd0e9-2488-bcee-82f5-2962357628c6",
        "actionType": "Upload",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Path": ""
        },
        "nestingLevel": 2,
        "marginLeft": 40
    },
    {
        "id": "b2e99639-4b35-dadf-9300-158c2b89230e",
        "actionType": "END",
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "ac5d98da-225d-db8b-3e90-d8f8bfc5bda6",
        "actionType": "Anchor",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": "",
            "value": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "421ff0a8-f86f-0abb-882a-9d855e2346bc",
        "actionType": "URL",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": "",
            "value": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "e0d05e6b-a586-911d-812b-0b87d8ce3b50",
        "actionType": "Anchor",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": "",
            "value": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "d6fe2b19-5a43-65c0-366c-51526bb21a63",
        "actionType": "Prompts",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "Response Type": {
                "Accept": false,
                "Decline": false
            },
            "Response Text": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "b94eb810-405f-561e-7ba1-94c8b2d4cd57",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "div:nth-of-type(2) > modal-dialog > div > div > div",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Search\n      \n      \n          \n            \n    \n\n          \n        \n          \n          \n            \n            \n          \n        \n          Clear\n            \n    \n\n\n\n      \n      \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n        \n                \n        \n          Owners\n        \n        \n          \n        \n          \n                \n    \n\n              \n          \n             jmorganca \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             srevinsaju \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             simoniz0r \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             nvm-sh \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             abetlen \n            \n          \n\n          Jump to\n        \n      \n        \n      \n                \n        \n          Repositories\n        \n        \n          \n        \n          \n                \n    \n\n              \n          \n             jmorganca/ollama \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             srevinsaju/discord-appimage \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             simoniz0r/Discord-AppImage \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             nvm-sh/nvm \n            \n          \n\n          Jump to\n        \n      \n        \n          \n                \n    \n\n              \n          \n             abetlen/llama-cpp-python \n            \n          \n\n          Jump to\n        \n      \n        \n      \n        \n      \n        \n          \n    \n\n        \n        \n    \n    10 suggestions.\n\n          \n            \n              Search syntax tips\n            \n                \n    Give feedback"
        },
        "marginLeft": 20
    },
    {
        "id": "55669b57-3e1a-c673-ef35-f03395297b13",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "SPAN",
            "selector": "span:nth-of-type(2) > span > span",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "jmorganca"
        },
        "marginLeft": 20
    },
    {
        "id": "c8caaeb9-845a-f9d0-1333-0e31e7470b5a",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Navigate",
        "props": {
            "url": "https://github.com/jmorganca",
            "tabId": 1010965035,
            "windowId": 1010964918
        },
        "marginLeft": 20
    },
    {
        "id": "d4ecd835-d223-77c9-e406-294d67936ab9",
        "actionType": "NewTab",
        "nestingLevel": 1,
        "recorded": false,
        "props": {
            "url": ""
        },
        "marginLeft": 20
    },
    {
        "id": "3599db51-00d6-418c-dc3f-14680912a3fe",
        "actionType": "Anchor",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": "",
            "value": ""
        },
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "0814d5dd-4212-d8fb-732a-91da3a8e89ae",
        "actionType": "IF",
        "nestingLevel": 1,
        "conditions": [
            {
                "selectedVariable": "",
                "selectedType": "Element",
                "selectedOption": "IsVisible",
                "requiresCheck": true,
                "checkValue": ""
            }
        ],
        "marginLeft": 20
    },
    {
        "id": "6918b245-5243-62d0-2ed3-f8803d10b15f",
        "actionType": "END",
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "add68698-33bf-d0ce-80c7-bf0609792ced",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "754c7143-d978-0260-0fde-b5f23186f620",
        "actionType": "END",
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "2a37b6b8-f352-2ca2-d8ec-fdba45c81e13",
        "actionType": "List",
        "recorded": false,
        "props": {
            "nodeName": "",
            "selector": "",
            "variable": ""
        },
        "nestingLevel": 0,
        "marginLeft": 0
    },
    {
        "id": "fb4bbd82-15b0-95fd-6476-0ec6615d3e7e",
        "actionType": "Sheet",
        "props": {},
        "nestingLevel": 1,
        "marginLeft": 20
    },
    {
        "id": "d979f7fe-c601-117f-31e6-7e89ed908c23",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "main > div",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Jeffrey Morgan\n        \n        \n          jmorganca\n\n        \n      \n    \n  \n\n  \n\n  \n    \n        \n              \n                \n                \n  \n      \n        \n\n    \n      \n  \n\n              \n        \n\n\n    \n\n    \n\n  Previously at @docker @twitter @google\n\n\n    \n      \n        \n          \n    \n\n          1k\n          followers\n        · \n          1\n          following\n        \n      \n    \n\n  \n\n      \n        Toronto\n\n\n      \n          jmorganca@gmail.com\n\n    \n    \n\n      https://ollama.ai\n\n      Twitter\n\n        @jmorgan\n\n  \n\n\n  \n\n      \n    Achievementsx3x4x3BetaSend feedbackAchievementsx3x4x3BetaSend feedback\n    Highlights\n    \n    \n\n\n  Pro\n\n\n\n    \n    \n          \n        Block or Report\n      \n\n  \n    \n      \n        \n    \n\n      \n        Block or report jmorganca\n    \n      \n            \n      \n          \n        \n\n        Block user\n        \n            Prevent this user from interacting with your repositories and sending you notifications.\n          Learn more about blocking users.\n        \n\n\n\n\n\n\n          \n            Add an optional note:\n              \n      \n        Note\n    \n  \n    \n      \n\n    \n  \n    \n\n  \n    \n\n  \n\n      Please don't include any personal information such as legal names or email addresses. Maximum 100 characters, markdown supported. This note will be visible to only you.\n\n\n\n          \n\n        \n          Block user\n        \n    \n    \n      Report abuse\n      \n        Contact GitHub support about this user’s behavior.\n        Learn more about reporting abuse.\n      \n      Report abuse\n    \n\n      \n  \n\n\n\n\n      \n\n        \n\n        \n          \n    \n\n\n\n\n\n\n  \n  \n      Pinned\n    \n  \n  \n\n    \n  \n\n      \n      \n  \n    \n      \n        \n            \n    \n\n          \nollama\nollama          Public\n        \n      \n\n\n      \n        Get up and running with Llama 2 and other large language models locally\n      \n\n      \n          \n  \n  Go\n\n\n          \n            \n    \n\n            27k\n          \n          \n            \n    \n\n            1.7k\n          \n      \n    \n  \n\n\n\n\n\n\n\n\n\n      \n  \n    \n  \n\n\n  \n\n\n    \n      1,832\n      contributions\n        in the last year\n    \n\n    \n      \n        \n\n\n  4 contributions on December 18th.No contributions on December 25th.1 contribution on January 1st.No contributions on January 8th.No contributions on January 15th.1 contribution on January 22nd.1 contribution on January 29th.No contributions on February 5th.No contributions on February 12th.No contributions on February 19th.No contributions on February 26th.No contributions on March 5th.1 contribution on March 12th.9 contributions on March 19th.No contributions on March 26th.No contributions on April 2nd.No contributions on April 9th.No contributions on April 16th.No contributions on April 23rd.No contributions on April 30th.No contributions on May 7th.No contributions on May 14th.14 contributions on May 21st.No contributions on May 28th.1 contribution on June 4th.No contributions on June 11th.No contributions on June 18th.14 contributions on June 25th.5 contributions on July 2nd.4 contributions on July 9th.11 contributions on July 16th.4 contributions on July 23rd.5 contributions on July 30th.12 contributions on August 6th.No contributions on August 13th.1 contribution on August 20th.6 contributions on August 27th.10 contributions on September 3rd.12 contributions on September 10th.1 contribution on September 17th.11 contributions on September 24th.3 contributions on October 1st.No contributions on October 8th.14 contributions on October 15th.No contributions on October 22nd.6 contributions on October 29th.1 contribution on November 5th.2 contributions on November 12th.18 contributions on November 19th.10 contributions on November 26th.No contributions on December 3rd.7 contributions on December 10th.3 contributions on December 17th.5 contributions on December 19th.No contributions on December 26th.No contributions on January 2nd.8 contributions on January 9th.3 contributions on January 16th.11 contributions on January 23rd.No contributions on January 30th.No contributions on February 6th.3 contributions on February 13th.No contributions on February 20th.1 contribution on February 27th.No contributions on March 6th.2 contributions on March 13th.7 contributions on March 20th.7 contributions on March 27th.No contributions on April 3rd.1 contribution on April 10th.2 contributions on April 17th.No contributions on April 24th.9 contributions on May 1st.6 contributions on May 8th.1 contribution on May 15th.6 contributions on May 22nd.7 contributions on May 29th.No contributions on June 5th.1 contribution on June 12th.No contributions on June 19th.1 contribution on June 26th.6 contributions on July 3rd.6 contributions on July 10th.4 contributions on July 17th.8 contributions on July 24th.3 contributions on July 31st.4 contributions on August 7th.No contributions on August 14th.2 contributions on August 21st.5 contributions on August 28th.18 contributions on September 4th.1 contribution on September 11th.2 contributions on September 18th.11 contributions on September 25th.4 contributions on October 2nd.1 contribution on October 9th.1 contribution on October 16th.9 contributions on October 23rd.3 contributions on October 30th.2 contributions on November 6th.5 contributions on November 13th.12 contributions on November 20th.1 contribution on November 27th.2 contributions on December 4th.6 contributions on December 11th.8 contributions on December 18th.9 contributions on December 20th.No contributions on December 27th.1 contribution on January 3rd.11 contributions on January 10th.2 contributions on January 17th.5 contributions on January 24th.No contributions on January 31st.9 contributions on February 7th.No contributions on February 14th.No contributions on February 21st.4 contributions on February 28th.No contributions on March 7th.1 contribution on March 14th.7 contributions on March 21st.8 contributions on March 28th.4 contributions on April 4th.No contributions on April 11th.1 contribution on April 18th.No contributions on April 25th.5 contributions on May 2nd.2 contributions on May 9th.1 contribution on May 16th.7 contributions on May 23rd.9 contributions on May 30th.No contributions on June 6th.1 contribution on June 13th.No contributions on June 20th.21 contributions on June 27th.1 contribution on July 4th.10 contributions on July 11th.18 contributions on July 18th.10 contributions on July 25th.15 contributions on August 1st.16 contributions on August 8th.10 contributions on August 15th.12 contributions on August 22nd.12 contributions on August 29th.6 contributions on September 5th.15 contributions on September 12th.3 contributions on September 19th.5 contributions on September 26th.8 contributions on October 3rd.7 contributions on October 10th.4 contributions on October 17th.9 contributions on October 24th.4 contributions on October 31st.2 contributions on November 7th.6 contributions on November 14th.16 contributions on November 21st.9 contributions on November 28th.6 contributions on December 5th.11 contributions on December 12th.10 contributions on December 19th.13 contributions on December 21st.No contributions on December 28th.No contributions on January 4th.9 contributions on January 11th.1 contribution on January 18th.14 contributions on January 25th.No contributions on February 1st.No contributions on February 8th.No contributions on February 15th.No contributions on February 22nd.4 contributions on March 1st.No contributions on March 8th.6 contributions on March 15th.No contributions on March 22nd.9 contributions on March 29th.No contributions on April 5th.No contributions on April 12th.No contributions on April 19th.No contributions on April 26th.1 contribution on May 3rd.7 contributions on May 10th.10 contributions on May 17th.9 contributions on May 24th.3 contributions on May 31st.2 contributions on June 7th.No contributions on June 14th.No contributions on June 21st.13 contributions on June 28th.8 contributions on July 5th.9 contributions on July 12th.21 contributions on July 19th.9 contributions on July 26th.10 contributions on August 2nd.1 contribution on August 9th.7 contributions on August 16th.6 contributions on August 23rd.10 contributions on August 30th.8 contributions on September 6th.6 contributions on September 13th.8 contributions on September 20th.6 contributions on September 27th.2 contributions on October 4th.13 contributions on October 11th.2 contributions on October 18th.13 contributions on October 25th.3 contributions on November 1st.2 contributions on November 8th.9 contributions on November 15th.7 contributions on November 22nd.5 contributions on November 29th.2 contributions on December 6th.9 contributions on December 13th.4 contributions on December 20th.4 contributions on December 22nd.1 contribution on December 29th.5 contributions on January 5th.9 contributions on January 12th.1 contribution on January 19th.7 contributions on January 26th.No contributions on February 2nd.No contributions on February 9th.No contributions on February 16th.No contributions on February 23rd.1 contribution on March 2nd.No contributions on March 9th.5 contributions on March 16th.4 contributions on March 23rd.3 contributions on March 30th.2 contributions on April 6th.1 contribution on April 13th.No contributions on April 20th.No contributions on April 27th.2 contributions on May 4th.4 contributions on May 11th.10 contributions on May 18th.13 contributions on May 25th.1 contribution on June 1st.1 contribution on June 8th.2 contributions on June 15th.2 contributions on June 22nd.11 contributions on June 29th.29 contributions on July 6th.2 contributions on July 13th.17 contributions on July 20th.7 contributions on July 27th.6 contributions on August 3rd.19 contributions on August 10th.14 contributions on August 17th.6 contributions on August 24th.8 contributions on August 31st.12 contributions on September 7th.7 contributions on September 14th.7 contributions on September 21st.1 contribution on September 28th.4 contributions on October 5th.6 contributions on October 12th.10 contributions on October 19th.4 contributions on October 26th.12 contributions on November 2nd.8 contributions on November 9th.15 contributions on November 16th.5 contributions on November 23rd.12 contributions on November 30th.2 contributions on December 7th.7 contributions on December 14th.14 contributions on December 21st.No contributions on December 23rd.No contributions on December 30th.7 contributions on January 6th.13 contributions on January 13th.2 contributions on January 20th.2 contributions on January 27th.No contributions on February 3rd.5 contributions on February 10th.2 contributions on February 17th.11 contributions on February 24th.1 contribution on March 3rd.No contributions on March 10th.2 contributions on March 17th.No contributions on March 24th.1 contribution on March 31st.1 contribution on April 7th.1 contribution on April 14th.No contributions on April 21st.1 contribution on April 28th.5 contributions on May 5th.1 contribution on May 12th.10 contributions on May 19th.10 contributions on May 26th.2 contributions on June 2nd.2 contributions on June 9th.No contributions on June 16th.5 contributions on June 23rd.13 contributions on June 30th.16 contributions on July 7th.3 contributions on July 14th.10 contributions on July 21st.13 contributions on July 28th.4 contributions on August 4th.20 contributions on August 11th.6 contributions on August 18th.3 contributions on August 25th.15 contributions on September 1st.6 contributions on September 8th.3 contributions on September 15th.12 contributions on September 22nd.3 contributions on September 29th.2 contributions on October 6th.6 contributions on October 13th.10 contributions on October 20th.16 contributions on October 27th.11 contributions on November 3rd.6 contributions on November 10th.14 contributions on November 17th.3 contributions on November 24th.7 contributions on December 1st.2 contributions on December 8th.2 contributions on December 15th.1 contribution on December 22nd.No contributions on December 24th.2 contributions on December 31st.2 contributions on January 7th.4 contributions on January 14th.No contributions on January 21st.No contributions on January 28th.No contributions on February 4th.3 contributions on February 11th.4 contributions on February 18th.5 contributions on February 25th.No contributions on March 4th.No contributions on March 11th.4 contributions on March 18th.7 contributions on March 25th.No contributions on April 1st.No contributions on April 8th.No contributions on April 15th.No contributions on April 22nd.No contributions on April 29th.No contributions on May 6th.2 contributions on May 13th.4 contributions on May 20th.4 contributions on May 27th.2 contributions on June 3rd.6 contributions on June 10th.No contributions on June 17th.6 contributions on June 24th.4 contributions on July 1st.12 contributions on July 8th.5 contributions on July 15th.7 contributions on July 22nd.2 contributions on July 29th.4 contributions on August 5th.6 contributions on August 12th.3 contributions on August 19th.6 contributions on August 26th.4 contributions on September 2nd.8 contributions on September 9th.7 contributions on September 16th.16 contributions on September 23rd.5 contributions on September 30th.No contributions on October 7th.12 contributions on October 14th.6 contributions on October 21st.4 contributions on October 28th.3 contributions on November 4th.2 contributions on November 11th.18 contributions on November 18th.4 contributions on November 25th.6 contributions on December 2nd.7 contributions on December 9th.1 contribution on December 16th.\n    Contribution Graph\n\n    \n      \n        \n          Day of Week\n        \n\n\n          \n            December\n            Dec\n          \n\n          \n            January\n            Jan\n          \n\n          \n            February\n            Feb\n          \n\n          \n            March\n            Mar\n          \n\n          \n            April\n            Apr\n          \n\n          \n            May\n            May\n          \n\n          \n            June\n            Jun\n          \n\n          \n            July\n            Jul\n          \n\n          \n            August\n            Aug\n          \n\n          \n            September\n            Sep\n          \n\n          \n            October\n            Oct\n          \n\n          \n            November\n            Nov\n          \n\n          \n            December\n            Dec\n          \n      \n    \n\n    \n        \n          \n            Sunday\n            \n              Sun\n            \n          \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n        \n        \n          \n            Monday\n            \n              Mon\n            \n          \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n        \n        \n          \n            Tuesday\n            \n              Tue\n            \n          \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n        \n        \n          \n            Wednesday\n            \n              Wed\n            \n          \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n        \n        \n          \n            Thursday\n            \n              Thu\n            \n          \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n        \n        \n          \n            Friday\n            \n              Fri\n            \n          \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n        \n        \n          \n            Saturday\n            \n              Sat\n            \n          \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n                \n  \n\n              \n        \n    \n\n\n        \n          \n\n\n            \n              Learn how we count contributions\n          \n\n          \n            Less\n                \n    No contributions.\n\n                \n    Low contributions.\n\n                \n    Medium-low contributions.\n\n                \n    Medium-high contributions.\n\n                \n    High contributions.\n\n            More\n          \n        \n      \n\n    \n\n\n\n\n\n\n      \n            \n    \n  \n      \n    Year:\n          2023\n\n  \n    \n      \n    \n\n    \n\n\n\n\n  \n    \n                \n  \n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2023\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2022\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2021\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2020\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2019\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2018\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2017\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2016\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2015\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2014\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2013\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2012\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2011\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2010\n\n  \n  \n\n  \n\n\n\n      \n  \n\n  \n\n  \n    Contribution activity\n  \n\n  \n\n  \n    \n      December 2023\n    \n\n    \n  \n  \n  \n    \n\n          \n              \n            Created 26\n            commits in\n            1\n            repository\n          \n          \n            \n            \n          \n\n              \n            \n  \n    \n      jmorganca/ollama\n      \n        26 commits\n    \n\n    \n      \n        \n      \n    \n  \n\n          \n\n\n\n\n\n    \n\n\n      \n  \n  \n    \n\n      \n      \n        Created a pull request in jmorganca/ollama that received 14\n        comments\n      \n      \n        Dec 12\n    \n\n    \n        \n    \n\n      \n        \n          Add support for mixture of experts (MoE) and Mixtral\n        \n\n          \n            To build this branch:\ngo generate ./...\ngo build .\n\n./ollama serve # in another terminal\n./ollama run jmorgan/mixtral\n\nresolves #1470\nresolves #1457\n…\n          \n\n        \n            \n              \n                +1\n              \n              \n                −1\n              \n              \n              lines changed\n              •\n            \n          14\n          comments\n        \n      \n    \n\n\n\n\n    \n  \n  \n  \n    \n\n          \n              \n            Opened 2\n            other\n            pull requests in\n            1\n            repository\n          \n          \n            \n            \n          \n\n              \n    \n          \n        jmorganca/ollama\n        \n            \n              2\n            \n            merged\n        \n      \n\n          \n          \n            \n              \n                \n    \n\n                \n                  Fix issues with /set template and /set system\n              \n            \n            \n              \n                This contribution was made on Dec 13\n              \n              \n                Dec 13\n              \n            \n          \n          \n            \n              \n                \n    \n\n                \n                  Docs for multimodal support\n              \n            \n            \n              \n                This contribution was made on Dec 13\n              \n              \n                Dec 13\n              \n            \n          \n      \n\n\n\n\n\n\n    \n  \n  \n  \n    \n\n          \n              \n            Reviewed 26\n            pull requests in\n            2\n            repositories\n          \n          \n            \n            \n          \n\n              \n            \n    \n          \n        jmorganca/ollama\n        \n          25 pull requests\n        \n      \n\n          \n          \n            \n              \n                  \n    \n\n                \n                  Add cgo implementation for llama.cpp\n              \n            \n            \n              \n                This contribution was made on Dec 21\n              \n              \n                Dec 21\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  add FAQ for slow networking in WSL2\n              \n            \n            \n              \n                This contribution was made on Dec 21\n              \n              \n                Dec 21\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Clean up documentation\n              \n            \n            \n              \n                This contribution was made on Dec 19\n              \n              \n                Dec 19\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Lets get rid of these old modelfile examples\n              \n            \n            \n              \n                This contribution was made on Dec 19\n              \n              \n                Dec 19\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  send empty messages on last chat response\n              \n            \n            \n              \n                This contribution was made on Dec 19\n              \n              \n                Dec 19\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  add magic header for unit tests\n              \n            \n            \n              \n                This contribution was made on Dec 16\n              \n              \n                Dec 16\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  add API tests for list handler\n              \n            \n            \n              \n                This contribution was made on Dec 15\n              \n              \n                Dec 15\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Add unit test of API routes\n              \n            \n            \n              \n                This contribution was made on Dec 15\n              \n              \n                Dec 15\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  restore model load duration on generate response\n              \n            \n            \n              \n                This contribution was made on Dec 14\n              \n              \n                Dec 14\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  add image support to the chat api\n              \n            \n            \n              \n                This contribution was made on Dec 13\n              \n              \n                Dec 13\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  retry on concurrent request failure\n              \n            \n            \n              \n                This contribution was made on Dec 12\n              \n              \n                Dec 12\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Update readmes, requirements, packagejsons, etc for all examples\n              \n            \n            \n              \n                This contribution was made on Dec 12\n              \n              \n                Dec 12\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Multimodal support\n              \n            \n            \n              \n                This contribution was made on Dec 12\n              \n              \n                Dec 12\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Added mention of the NOPRUNE env var\n              \n            \n            \n              \n                This contribution was made on Dec 10\n              \n              \n                Dec 10\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  fix: parallel queueing race condition caused silent failure\n              \n            \n            \n              \n                This contribution was made on Dec 9\n              \n              \n                Dec 9\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  fix: encode full previous prompt in context\n              \n            \n            \n              \n                This contribution was made on Dec 9\n              \n              \n                Dec 9\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  update for qwen\n              \n            \n            \n              \n                This contribution was made on Dec 5\n              \n              \n                Dec 5\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Ollama Telegram Bot\n              \n            \n            \n              \n                This contribution was made on Dec 4\n              \n              \n                Dec 4\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  make linewrap still work when the terminal width has changed\n              \n            \n            \n              \n                This contribution was made on Dec 2\n              \n              \n                Dec 2\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  handle ctrl+z\n              \n            \n            \n              \n                This contribution was made on Dec 2\n              \n              \n                Dec 2\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  Add /chat API\n              \n            \n            \n              \n                This contribution was made on Dec 2\n              \n              \n                Dec 2\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  split from into one or more models\n              \n            \n            \n              \n                This contribution was made on Dec 1\n              \n              \n                Dec 1\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  allow setting the system and template for prompts in the repl\n              \n            \n            \n              \n                This contribution was made on Dec 1\n              \n              \n                Dec 1\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  docker: set PATH, LD_LIBRARY_PATH, and capabilities\n              \n            \n            \n              \n                This contribution was made on Dec 1\n              \n              \n                Dec 1\n              \n            \n          \n          \n            \n              \n                  \n    \n\n                \n                  load projectors\n              \n            \n            \n              \n                This contribution was made on Dec 1\n              \n              \n                Dec 1\n              \n            \n          \n      \n\n\n    \n          \n        mxyng/quantize\n        \n          1 pull request\n        \n      \n\n          \n          \n            \n              \n                  \n    \n\n                \n                  convert and quantize llava models\n              \n            \n            \n              \n                This contribution was made on Dec 1\n              \n              \n                Dec 1\n              \n            \n          \n      \n\n\n          \n\n\n\n\n\n      \n  \n  \n    \n\n      \n      \n        Created an issue in\n        ggerganov/llama.cpp\n        that received 5\n        comments\n      \n      \n        Dec 19\n    \n\n    \n        \n    \n\n      \n        \n          Phi provides empty response\n        \n\n          \n            I'm not sure if this is a problem with the model weights, but when running Phi on master, converted from https://huggingface.co/microsoft/phi-2\nCur…\n          \n        \n          5\n          comments\n        \n      \n    \n\n\n\n    \n  \n  \n  \n    \n\n          \n              \n            Opened 1\n            other\n            issue\n            in 1\n            repository\n          \n          \n            \n            \n          \n\n              \n    \n          \n        jmorganca/ollama\n        \n            \n              1\n            \n            open\n        \n      \n\n          \n          \n            \n              \n                  \n    \n\n                \n                  Multi-line strings/paste capture / commands\n              \n            \n            \n              \n                This contribution was made on Dec 19\n              \n              \n                Dec 19\n              \n            \n          \n      \n\n\n\n\n\n\n\n    \n\n    \n\n\n    \n\n\n\n      \n  \n  \n    \n\n            \n            60\n            contributions\n            in private repositories\n          \n          \n            Dec 1 – Dec 22\n          \n\n\n\n    \n  \n\n\n\n\n\n    \n  \n  \n\n\n    Show more activity\n\n  \n    Seeing something unexpected? Take a look at the\n    GitHub profile guide.\n  \n\n\n\n      \n  \n  \n    \n\n  \n    \n        \n          2023\n        \n        \n          2022\n        \n        \n          2021\n        \n        \n          2020\n        \n        \n          2019\n        \n        \n          2018\n        \n        \n          2017\n        \n        \n          2016\n        \n        \n          2015\n        \n        \n          2014\n        \n        \n          2013\n        \n        \n          2012\n        \n        \n          2011\n        \n        \n          2010\n        \n    \n  \n\n\n  \n    \n  \n      \n    Year:\n          2023\n\n  \n    \n      \n    \n\n    \n\n\n\n\n  \n    \n                \n  \n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2023\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2022\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2021\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2020\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2019\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2018\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2017\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2016\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2015\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2014\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2013\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2012\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2011\n\n  \n  \n\n      \n    \n    \n        \n          \n    \n\n        \n      \n        \n          2010"
        },
        "marginLeft": 20
    },
    {
        "id": "4850661c-3c50-4ab7-2dda-271275ef9bfa",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "main > div > div > div > div > div",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Jeffrey Morgan\n        \n        \n          jmorganca\n\n        \n      \n    \n  \n\n  \n\n  \n    \n        \n              \n                \n                \n  \n      \n        \n\n    \n      \n  \n\n              \n        \n\n\n    \n\n    \n\n  Previously at @docker @twitter @google\n\n\n    \n      \n        \n          \n    \n\n          1k\n          followers\n        · \n          1\n          following\n        \n      \n    \n\n  \n\n      \n        Toronto\n\n\n      \n          jmorganca@gmail.com\n\n    \n    \n\n      https://ollama.ai\n\n      Twitter\n\n        @jmorgan\n\n  \n\n\n  \n\n      \n    Achievementsx3x4x3BetaSend feedbackAchievementsx3x4x3BetaSend feedback\n    Highlights\n    \n    \n\n\n  Pro\n\n\n\n    \n    \n          \n        Block or Report\n      \n\n  \n    \n      \n        \n    \n\n      \n        Block or report jmorganca\n    \n      \n            \n      \n          \n        \n\n        Block user\n        \n            Prevent this user from interacting with your repositories and sending you notifications.\n          Learn more about blocking users.\n        \n\n\n\n\n\n\n          \n            Add an optional note:\n              \n      \n        Note\n    \n  \n    \n      \n\n    \n  \n    \n\n  \n    \n\n  \n\n      Please don't include any personal information such as legal names or email addresses. Maximum 100 characters, markdown supported. This note will be visible to only you.\n\n\n\n          \n\n        \n          Block user\n        \n    \n    \n      Report abuse\n      \n        Contact GitHub support about this user’s behavior.\n        Learn more about reporting abuse.\n      \n      Report abuse"
        },
        "marginLeft": 20
    },
    {
        "id": "08038710-5ed4-5ae2-62da-587b19a5247d",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "DIV",
            "selector": "main > div > div > div > div > div",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Jeffrey Morgan\n        \n        \n          jmorganca\n\n        \n      \n    \n  \n\n  \n\n  \n    \n        \n              \n                \n                \n  \n      \n        \n\n    \n      \n  \n\n              \n        \n\n\n    \n\n    \n\n  Previously at @docker @twitter @google\n\n\n    \n      \n        \n          \n    \n\n          1k\n          followers\n        · \n          1\n          following\n        \n      \n    \n\n  \n\n      \n        Toronto\n\n\n      \n          jmorganca@gmail.com\n\n    \n    \n\n      https://ollama.ai\n\n      Twitter\n\n        @jmorgan\n\n  \n\n\n  \n\n      \n    Achievementsx3x4x3BetaSend feedbackAchievementsx3x4x3BetaSend feedback\n    Highlights\n    \n    \n\n\n  Pro\n\n\n\n    \n    \n          \n        Block or Report\n      \n\n  \n    \n      \n        \n    \n\n      \n        Block or report jmorganca\n    \n      \n            \n      \n          \n        \n\n        Block user\n        \n            Prevent this user from interacting with your repositories and sending you notifications.\n          Learn more about blocking users.\n        \n\n\n\n\n\n\n          \n            Add an optional note:\n              \n      \n        Note\n    \n  \n    \n      \n\n    \n  \n    \n\n  \n    \n\n  \n\n      Please don't include any personal information such as legal names or email addresses. Maximum 100 characters, markdown supported. This note will be visible to only you.\n\n\n\n          \n\n        \n          Block user\n        \n    \n    \n      Report abuse\n      \n        Contact GitHub support about this user’s behavior.\n        Learn more about reporting abuse.\n      \n      Report abuse"
        },
        "marginLeft": 20
    },
    {
        "id": "d59ecbd5-1ccf-0cb6-0d54-660ce0289ed9",
        "recorded": true,
        "nestingLevel": 1,
        "actionType": "Click",
        "props": {
            "nodeName": "LI",
            "selector": "div:nth-of-type(2) > ul > li:nth-of-type(4)",
            "Wait For New Page To Load": false,
            "Wait For File Download": false,
            "Description": "Twitter\n\n        @jmorgan"
        },
        "marginLeft": 20
    }
]

export type TNodeData = {
    isDragging: boolean;
    isDragSelect: boolean;
    index: number;
    hideTopHandle: boolean;
    action: TAction;
    current: any;
    dispatch: any;
}

const node_template = (
    id: string,
    data: TNodeData,
    x: number,
    y: number,
) => ({
    id,
    position: { x, y },
    data,
});

type TEdgeData = {
    offset: number | null;
    isRedEdge: boolean;
};
const edge_template = (
    id: string,
    data: TEdgeData,
    source: string,
    target: string,
    sourceHandle: string,
    type: string,
    label: string,
    style: React.CSSProperties,
    animated: boolean
) => ({
    id,
    data,
    source,
    target,
    sourceHandle,
    type,
    label,
    style,
    animated: animated ? animated : false,
});
const nextOfEndActionTargetId = (id: string, actions: TAction[]) => {
    let targetActionId: number | null = null;

    let ifNestingLevel: number | null = null;
    actions.forEach((curr_action, index) => {
        if (targetActionId || !curr_action)
            return;

        if (curr_action.id === id) {
            ifNestingLevel = curr_action.nestingLevel;
            return;
        }

        if (curr_action.actionType === "END" && curr_action.nestingLevel === ifNestingLevel) {
            targetActionId = index;
            return;
        }
    });

    return targetActionId;
};

const nextOfEndNodeId = (id: string, nodes: Node[]) => {
    let targetNodeId: number | null = null;

    let ifNestingLevel: number | null = null;
    nodes.forEach((curr_node, index) => {
        if (targetNodeId)
            return;

        if (curr_node.id === id) {
            ifNestingLevel = curr_node.data.action.nestingLevel;
            return;
        }

        if (curr_node.data.action.actionType === "END" && curr_node.data.action.nestingLevel === ifNestingLevel) {
            targetNodeId = curr_node.id;
            return;
        }
    });

    return targetNodeId;
};

type TCreatedNodesAndEdges = { nodes: Node[]; edges: Edge[]; } | null;

const actionsToRedEdges = (nodes: Node[]): TCreatedNodesAndEdges => {
    if (!Array.isArray(nodes) || nodes.length === 0) {
        console.warn("[warning] fn actionsToFlow: passed bad argument - (nodes: Node[])");
        return null;
    }

    let _edges: Edge[] = [];

    nodes.forEach((n, index) => {
        if (index > 0) {
            const prevIndex = index - 1;
            const prevNode = nodes[prevIndex];
            const prevActionType = prevNode.data.action.actionType;

            // Adding an extra edge for special nodes
            if (["IF"].includes(prevActionType)) {  // && nodes[index + 1].data.action.actionType !== "END"
                const redEdgeTargetId = nextOfEndNodeId(prevNode.id, nodes);

                nodes.find((n, ix) => n.data.action.actionType === "END")

                if (redEdgeTargetId !== null) {
                    _edges.push(edge_template(
                        `e${prevNode.id}-${redEdgeTargetId}`, //id
                        { offset: (redEdgeTargetId - +prevNode.id) * 100, isRedEdge: true }, //data
                        String(prevNode.id), //source id
                        String(redEdgeTargetId), //target id
                        "bottom",    // nodes[prevIndex].id + prevActionType, //sourceHandle id
                        'actionEdge', //Connection Line type
                        String(redEdgeTargetId), //label
                        { stroke: "red" }, //stroke color
                        false, //animated?
                    ));
                }
            }
        }
    });

    return _edges;
};

const actionsToFlowWithNullItems = (actions: any): TCreatedNodesAndEdges => {
    if (!Array.isArray(actions) || actions.length === 0) {
        console.warn("[warning] fn actionsToFlow: passed bad argument - (actions: TAction[])");
        return null;
    }

    const v_dist = 100;
    const h_dist = 200;

    let _edges: Edge[] = [];
    let indexBeforeNull: number | null = null;

    let nullCount = 0;
    const _nodes: any = actions.map((a, index) => {
        if (!a) {
            
            nullCount++;

            if (actions[index - 1]) {
                indexBeforeNull = index - 1;
            }
            return null;
        }

        if (index > 0) {
            const prevIndex = actions[index - 1] ? index - 1 : indexBeforeNull;
            if (prevIndex !== null) {
                const prevAction = actions[prevIndex];
                const prevActionType = prevAction.actionType;
                const edgeId = `e${prevIndex}-${index}`;

                // Adding an extra edge for special actions
                if (["IF"].includes(prevActionType)) {
                    const redEdgeTargetId = nextOfEndActionTargetId(prevAction.id, actions);
                    if (redEdgeTargetId !== null) {
                        _edges.push(edge_template(
                            `e${prevIndex}-${redEdgeTargetId}`, //id
                            { offset: (redEdgeTargetId - prevIndex) * 100, isRedEdge: true }, //data
                            String(prevIndex), //source id
                            String(redEdgeTargetId), //target id
                            "bottom",    // actions[prevIndex].id + prevActionType, //sourceHandle id
                            'actionEdge', //Connection Line type
                            String(redEdgeTargetId), //label
                            { stroke: "red" }, //stroke color
                            false, //animated?
                        ));
                    }
                }

                const isIfEndLoop = prevActionType === "IF" && a.actionType === "END";
                if(!isIfEndLoop){
                    _edges.push(
                        edge_template(
                            edgeId, //id
                            { offset: null, isRedEdge: false }, // data
                            String(prevIndex), //source id
                            String(index), //target id
                            ["IF"].includes(prevActionType) ? "right" : "bottom",    // actions[prevIndex].id, //sourceHandle id
                            'actionEdge', //Connection Line type
                            String(index), //label
                            { stroke: "lightgreen" }, //stroke color,
                            false, //animated? 
                        )
                    );
                }

            }
        }

        const node_x = 
            index === 0 
                ? 0 
                // : a.actionType === "END" 
                //     ? a.nestingLevel + 1 * h_dist
                : a.nestingLevel * h_dist;
        const node_y = Math.abs(index * v_dist - (nullCount * 100));
        const data = {
            isDragging: false,
            index,
            isDragSelect: false,
            action: a,
            current: null,
            hideTopHandle: index === 0 || index === 1 && !actions[index - 1] ? true : false,
            dispatch: null
        };

        return {
            type: "actionNode",
            ...node_template(
                String(index),
                data,
                node_x,
                node_y,
            )
        } satisfies Node;
    });

    return { nodes: _nodes.filter((n: any) => n), edges: _edges };
};

const SelectionTest = () => {
    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            console.log("[useOnSelectionChange] nodes: ", nodes, ", edges: ", edges);

            // setEdges(edges.map((edge) => {
                
            // }));
        },
    });

    return null;
};

//:::::::::::::::::::: CREATE EDGES :::::::::::::::::::::::::::
function createGreenEdgesBetween(originalNodes, headNode, middleNode, tailNode){
    if(!headNode || !middleNode){
        console.error("!headNode || !middleNode || tailNode");
    }

    let newEdges = [];

    //TODO: 
    // For dragSelect, pass the top and bottom node of the selections as an Array.
    // const allNodes = [headNode, ...(Array.isArray(middleNode) ? middleNode : [middleNode]), tailNode]

    const allNodes = [headNode, middleNode, tailNode];

    allNodes.forEach((currNode, index) => {
        const isLastIndex = index === allNodes.length - 1;
        const nextNode = allNodes[index + 1];
        const prevNode = allNodes[index -1];

        //red edge
        // if(
        //     index === 1 
        //     && ["IF", "END"].includes(currNode.data.action.actionType)
        // ){
        //     const isIF = currNode.data.action.actionType === "IF";
        //     const lookup = isIF ? "END" : "IF"
        //     const hasCorrectIndex = (lookupindex) => isIF ? lookupindex > +currNode.id : +currNode.id > lookupindex;

        //     if(!(allNodes[index + 1]?.data?.action?.actionType === "IF" && currNode.data.action.actionType === "END")){
        //         const if_end_index = originalNodes.findIndex((nd, lookupindex) => 
        //             nd.data.action.actionType === lookup
        //             && nd.data.action.nestingLevel === currNode.data.action.nestingLevel
        //             && hasCorrectIndex(lookupindex)
        //         );

        //         if(if_end_index !== -1){
        //             const if_end_ID = originalNodes[if_end_index].id;

        //             const redsource = isIF ? String(currNode.id) : String(if_end_ID);
        //             const redtarget = isIF ? String(if_end_ID) : String(currNode.id);
        //             const redid = `e${redsource}-${redtarget}`;
        //             const offset = Math.abs((((isIF ? +redtarget - +redsource : +redtarget - +redsource) + 1) * 100));

        //             newEdges.push({
        //                 id : redid,
        //                 source: redsource,
        //                 target: redtarget,
        //                 data: {offset, isRedEdge: true},
        //                 type: 'actionEdge',
        //                 label: `${redtarget} -> new ::`,
        //                 animated: false,
        //                 sourceHandle: "bottom",
        //                 style: { stroke: 'red' }
        //             });    
        //         }

        //     }
        // }


        if((index === 1 && !tailNode) || isLastIndex)
            return;

        let id = `e${currNode.id}-${nextNode.id}`;
        let source = String(currNode.id);
        let target = String(nextNode.id);
        let sourceHandle = "bottom";

        const isIfEndLoop = currNode.data.action.actionType === "IF" && nextNode && nextNode.data.action.actionType === "END";

        if(isIfEndLoop)
            return;

        if(index === 0 && currNode.data.action.actionType === "IF"){
            sourceHandle =  "right";
        }

        newEdges.push({
            id,
            source,
            target,
            data: {offset: null, isRedEdge: false},
            type: 'actionEdge',
            label: target,
            animated: false,
            sourceHandle,
        });
    })

    return newEdges;
}
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function ActionsView(): JSX.Element | null {
    const n_e = useMemo(() => actionsToFlowWithNullItems(EvaluateNesting(BrowserActions)), []);

    const [nodes, setNodes, onNodesChange] = useNodesState(n_e ? n_e.nodes : []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(n_e ? n_e.edges : []);

    const draggedNodeRestore = useRef<{ nodes: Node[]; edges: Edge[]; } | null>();
    const [intNode, setIntNode] = useState();
    const [isFlowDragging, setIsFlowDragging] = useState(false);
    const [nodesBeforeDrag, setNodesBeforeDrag] = useState();

    const flowinstance = useReactFlow();

    //::::::::::::::::::::::::::::::::::: SELECTON DRAG :::::::::::::::::::::::::::::::::::
    const onSelectionDragStart = useCallback((event: React.MouseEvent, selectedNodes: Node[]) => {
        PerformanceLogger.start("onSelectionDragStart");
        
        setIsFlowDragging(true);

        if (!draggedNodeRestore.current) {
            draggedNodeRestore.current = {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges))
            }
        }

        let nonSelectedNodes = nodes.map((node: any) => selectedNodes.some(selectedNode => selectedNode.data.action.id === node.data.action.id) ? null : node);
        nonSelectedNodes = EvaluateNesting(nonSelectedNodes.map(fln => fln?.data?.action));
        const {nodes: newNodes, edges: newEdges} : TCreatedNodesAndEdges = actionsToFlowWithNullItems(nonSelectedNodes);

        if(!newNodes || !newEdges)
            return;

        // const start_y_dist = selectedNodes[0].position.y;
        const updatedSelectedNodes = selectedNodes.map((n, index) => {
            // const new_y_dist = (index === 0) ? start_y_dist : (start_y_dist + 100);
            // n.position.y = new_y_dist
            // n.positionAbsolute.y = new_y_dist;
            n.data = { ...n.data, isDragSelect: true };
            return n;
        });
        setNodes([...newNodes, ...updatedSelectedNodes]);

        let selectedEdges = edges.filter(e =>
            selectedNodes.some(n => n.id === e.source)
                &&
            selectedNodes.some(n => n.id === e.target)
        );
        setEdges([...newEdges.filter(nf => !selectedEdges.some(se => se.id === nf.id))]); //, ...selectedEdges

        PerformanceLogger.stop("onSelectionDragStart");
    }, [setNodes, setEdges, nodes, edges]);

    const onSelectionDragStop = useCallback((event: React.MouseEvent, selectedNodes: Node[]) => {
        setIsFlowDragging(false);

        // if(!intNode){
        //     console.warn("intNode is null");
        //     return;
        // }

        // const startIndex = nodes.findIndex(n => n.id === intNode.id);
        // const nodesCopy = JSON.parse(JSON.stringify(nodes));

        // nodesCopy.splice(startIndex + 1, 0 , ...selectedNodes);
        // console.log("onSelectionDragStop: ", nodesCopy);

        // const computedActions = EvaluateNesting(nodesCopy.map(n => n.data.action));
        // const {nodes: newNodes, edges: newEdges} = actionsToFlowWithNullItems(computedActions);

        // console.log("newNodes: ", newNodes, ", newEdges: ", newEdges);

        // setNodes(newNodes);
        // setEdges(newEdges);
    }, [draggedNodeRestore, setNodes, setEdges, nodes, edges, intNode, setIntNode, setIsFlowDragging]);

    const onSelectionDrag = useCallback((event: React.MouseEvent, _nodes: Node[]) => {
        PerformanceLogger.start("onSelectionDrag");
        
        setIsFlowDragging(true);

        const top: Node = _nodes[0];
        const intersectedNode = nodes.find(n => 
            n.id !== top.id
            &&
            n.position.y <= top.position.y
            &&
            n.position.y >= top.position.y - 142
        );

        if (!intersectedNode)
            return;

        setIntNode(intersectedNode)

        const intr_node_id = intersectedNode.id;
        const newEdgeId = `e${intr_node_id}-${top.id}`;

        const filteredEdges = edges.filter(e => e.target !== top.id);

        if (!edges.some(e => e.id === newEdgeId)) {
            const newEdge: Edge = edge_template(
                newEdgeId,
                { offset: null, isRedEdge: false },
                intr_node_id,
                String(top.id),
                intersectedNode.data.action.id,
                "actionEdge",
                intr_node_id,
                { stroke: "#00BFFF", strokeWidth: 4 },
                true
            );
            setEdges([...filteredEdges, newEdge]);
        }

        PerformanceLogger.stop("onSelectionDrag");
    }, [setNodes, setEdges, edges, nodes, setIntNode, setIsFlowDragging]);

    //::::::::::::::::::::::::::::::::::: NODE DRAG :::::::::::::::::::::::::::::::::::::::
    
    const onNodeDrag = useCallback((event: React.MouseEvent, _node: Node, _nodes: Node[]) => {
        PerformanceLogger.start("onNodeDrag");

        const intersectedNode = nodes.find(n => 
            n.id !== _node.id
                &&
            n.position.y <= _node.position.y
                &&
            n.position.y >= _node.position.y - 142
        );
        
        if (intNode?.id === intersectedNode?.id || !intersectedNode)
            return;

        setIntNode(intersectedNode);

        const intr_node_id = intersectedNode.id;
        const newEdgeId = `e${intr_node_id}-${_node.id}`;
        const filteredEdges = edges.filter(e => e.target !== _node.id);

        if (!edges.some(e => e.id === newEdgeId)) {
            const newEdge: Edge = edge_template(
                newEdgeId,
                { offset: null, isRedEdge: false },
                intr_node_id,
                String(_node.id),
                "right", //intersectedNode.data.action.id,
                "actionEdge",
                intr_node_id,
                { stroke: "#00BFFF", strokeWidth: 4 },
                true
            );

            setEdges([...filteredEdges, newEdge]);
        }

        PerformanceLogger.stop("onNodeDrag");
    }, [setNodes, setEdges, edges, nodes, intNode, setIntNode]);

    const onNodeDragStart = useCallback((event: React.MouseEvent, draggedNode: Node) => {
        setIsFlowDragging(true);
        setNodesBeforeDrag(JSON.parse(JSON.stringify(nodes)));

        if (!draggedNodeRestore.current) {
            draggedNodeRestore.current = {
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges))
            }
        }

        const nodesCopy = JSON.parse(JSON.stringify(nodes));
        const normalNodes = nodesCopy.filter(n => n.id !== draggedNode.id);
        const computed = EvaluateNesting(normalNodes.map(n => n.data.action));
        const computedNodes = normalNodes.map((sn, snIndex) => {
            if(sn.data.action.id === computed[snIndex].id)
                sn.data.action.nestingLevel = computed[snIndex].nestingLevel

            return sn;
        });
        setNodes([
            ...normalNodes.map((n, index) => {
                if(computed[index].id !== n.data.action.id){
                    console.error("computed[index].id !== n.data.action.id at index: ", index, "for node: ", n);
                }

                const v_dist = 100;
                const h_dist = 200;
                const nest_level = computed[index].nestingLevel;
                const x = 
                    index === 0 
                        ? 0 
                        // : n.data.action.actionType === "END" 
                        //     ? n.data.action.nestingLevel + 1 * h_dist
                        : nest_level * h_dist;
                const y = Math.abs(index * v_dist);

                n.position = {x, y};

                return n;
            }),
            {...draggedNode, data: {...draggedNode.data, isDragging: true, hideTopHandle: false}}
        ]);

        let newEdge;
        const isFirstNodeDrag = nodes.findIndex(n => n.id === draggedNode.id) === 0;
        const isLastNodeDrag = nodes.findIndex(n => n.id === draggedNode.id) === nodes.length - 1;

        if(!isFirstNodeDrag && !isLastNodeDrag){
            const incomers = getIncomers(draggedNode, nodes, edges);

            if(draggedNode.data.action.actionType === "END" && incomers.length === 2){
                console.log(`%c actionType === ${draggedNode.data.action.actionType}`, "color: orange;");
                console.log({incomers});
                console.log(`%c removing, incomers[0]`, "color: orange;");
                console.assert(incomers.length === 2, { incomers, msg: `Should only be two nodes when nodetype is "IF" or "END", unless there has been new changes.` });
                
                incomers.splice(0,1);
            }

            const outgoers = getOutgoers(draggedNode, nodes, edges);
            const isIfEndLoop = incomers[0].data.action.actionType === "IF" && outgoers[0].data.action.actionType === "END";
            
            if(!isIfEndLoop){
                newEdge = {
                    id: `e${incomers[0].id}-${outgoers[0].id}`,
                    source: incomers[0].id,
                    target: outgoers[0].id,
                    sourceHandle: incomers[0].data.action.actionType === "IF" ? "right" : "bottom",
                    type: 'actionEdge',
                    data: { offset: null, isRedEdge: false },
                    label: "",
                    animated: false,
                };
            }
        }

        const connectedEdges = getConnectedEdges([draggedNode], edges);
        let remainingEdges = edges.filter(e => !connectedEdges.includes(e));
        remainingEdges = remainingEdges.filter(re => re.data.isRedEdge === false);
        const newRedEdges = actionsToRedEdges(computedNodes);
        if(newEdge){
            setEdges([...remainingEdges, newEdge, ...newRedEdges]);
        }else{
            setEdges([...remainingEdges, ...newRedEdges]);
        }
    },
    [
        draggedNodeRestore,
        setEdges,
        nodes,
        edges,
        setIsFlowDragging,
        setNodesBeforeDrag
    ]);

    // working backup before createEdgesBetween
    // const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node, draggedNode: Node[]) => {
    //     setIsFlowDragging(false);

    //     if(!intNode){
    //         console.warn("intNode is null");
    //         return;
    //     }

    //     if(!nodesBeforeDrag){
    //         console.warn("nodesBeforeDrag is null");
    //         return;
    //     }

    //     const nodesCopy = JSON.parse(JSON.stringify(nodes));
    //     const splicedNodes = nodesCopy.filter(n => n.id !== draggedNode[0].id);
    //     const startIndex = splicedNodes.findIndex(n => n.id === intNode.id);
    //     splicedNodes.splice(startIndex + 1, 0, draggedNode[0]);

    //     const withoutDraggedNode = nodesCopy.filter(n => n.id !== draggedNode[0].id);
    //     const target = withoutDraggedNode[startIndex + 1];

    //     if(target){
    //         let incomers = getIncomers(target, withoutDraggedNode, edges);
    //         const targetOutgoers = getOutgoers(target, withoutDraggedNode, edges);
    //         const targetEdges = getConnectedEdges([target], edges);

    //         if(target.data.action.actionType === "END" && incomers.length === 2){
    //             incomers = [incomers[1]];
    //         }

    //         const incomerToDragEdge = incomers.flatMap(({id: source}) => 
    //             draggedNode.map((dragged) => 
    //                 ({
    //                     id: `e${source}-${dragged.id}`,
    //                     source: source,
    //                     target: dragged.id,
    //                     sourceHandle: incomers[0].data.action.actionType === "IF" ? "right" : "bottom",
    //                     label: String(dragged.id),
    //                     type: 'actionEdge',
    //                     data: {offset: null, isRedEdge: false},
    //                     animated: false
    //                 })
    //             )
    //         );
    //         const dragToTargetEdge = draggedNode.flatMap(({id: source}) => 
    //             [target].map((tar) => 
    //                 ({
    //                     id: `e${source}-${tar.id}`,
    //                     source: source,
    //                     target: tar.id,
    //                     sourceHandle: draggedNode[0].data.action.actionType === "IF" ? "right" : "bottom",
    //                     label: String(tar.id),
    //                     type: 'actionEdge',
    //                     data: {offset: null, isRedEdge: false},
    //                     animated: false
    //                 })
    //             )
    //         );

    //         let redEdge;
    //         if(draggedNode[0].data.action.actionType === "IF"){
    //             const redTargetId = nextOfEndActionTargetId(draggedNode[0].data.action.id, splicedNodes.map(w => w.data.action))
    //             redEdge = {
    //                 id: `e${draggedNode[0].id}-${redTargetId}`,
    //                 source: String(draggedNode[0].id),
    //                 target: String(redTargetId),
    //                 sourceHandle: "bottom",
    //                 label: String(redTargetId),
    //                 data: {offset: ((redTargetId - Number(draggedNode[0].id)) + 1) * 100, isRedEdge: true},
    //                 type: 'actionEdge',
    //                 animated: false,
    //                 style: {stroke: 'red'}
    //             }
    //         }

    //         //EDGES
    //         const remainingEdges = edges.filter(e => e.animated !== true && e.id !== `e${intNode.id}-${target.id}`);
    //         let newEdges = [...remainingEdges, ...incomerToDragEdge, ...dragToTargetEdge];
    //         if(redEdge){
    //             newEdges.push(redEdge);
    //         }
    //         setEdges(newEdges);
    //     }else if(!target){
    //         //EDGES
    //         let newEdges = [];
    //         if(draggedNode[0].data.action.actionType === "END"){
    //             const prevIfNodeIndex =
    //                 splicedNodes.findIndex(n =>
    //                     n.data.action.actionType === "IF"
    //                         &&
    //                     n.data.action.nestingLevel === draggedNode[0].data.action.nestingLevel
    //                 );

    //             newEdges.push({
    //                 id: `e${prevIfNodeIndex}-${draggedNode[0].id}`,
    //                 source: String(prevIfNodeIndex),
    //                 target: draggedNode[0].id,
    //                 sourceHandle: "bottom",
    //                 label: String(draggedNode[0].id),
    //                 type: 'actionEdge',
    //                 data: {offset: ((Number(draggedNode[0].id) - prevIfNodeIndex) + 1) * 100, isRedEdge: true},
    //                 animated: false
    //             });
    //         }

    //         newEdges.push({
    //             id: `e${intNode.id}-${draggedNode[0].id}`,
    //             source: intNode.id,
    //             target: draggedNode[0].id,
    //             sourceHandle: "bottom",
    //             label: String(draggedNode[0].id),
    //             type: 'actionEdge',
    //             data: {offset: null, isRedEdge: false},
    //             animated: false
    //         });
    //         const remainingEdges = edges.filter(e => e.animated !== true);
    //         setEdges([...remainingEdges, ...newEdges]);
    //     }

    //     //NODES
    //     const computed = EvaluateNesting(splicedNodes.map(un => un.data.action));
    //     setNodes(
    //         splicedNodes.map((n, index) => {
    //             if(computed[index].id !== n.data.action.id){
    //                 console.error("computed[index].id !== n.data.action.id at index: ", index, "for node: ", n);
    //             }

    //             const v_dist = 100;
    //             const h_dist = 200;
    //             const nest_level = computed[index].nestingLevel;
    //             const x = 
    //                 index === 0 
    //                     ? 0 
    //                     // : n.data.action.actionType === "END" 
    //                     //     ? n.data.action.nestingLevel + 1 * h_dist
    //                     : nest_level * h_dist;
    //             const y = Math.abs(index * v_dist);

    //             delete n.selected;
    //             delete n.dragging;
    //             delete n.width;
    //             delete n.height;
    //             delete n.positionAbsolute;

    //             n.position = { x, y };

    //             return n;
    //         })
    //     );
    // },
    // [
    //     draggedNodeRestore,
    //     setNodes,
    //     setEdges,
    //     nodes,
    //     edges,
    //     intNode,
    //     setIntNode,
    //     setIsFlowDragging,
    //     actionsToFlowWithNullItems,
    //     nodesBeforeDrag,
    //     setNodesBeforeDrag,
    // ]);

    const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node, draggedNode: Node[]) => {
        setIsFlowDragging(false);

        if(!intNode){
            console.warn("intNode is null");
            return;
        }

        if(!nodesBeforeDrag){
            console.warn("nodesBeforeDrag is null");
            return;
        }

        const nodesCopy = JSON.parse(JSON.stringify(nodes));
        const splicedNodes = nodesCopy.filter(n => n.id !== draggedNode[0].id);
        const startIndex = splicedNodes.findIndex(n => n.id === intNode.id);
        splicedNodes.splice(startIndex + 1, 0, draggedNode[0]);
        const computedActions = EvaluateNesting(splicedNodes.map(un => un.data.action));
        const computedNodes = splicedNodes.map((sn, snIndex) => {
            if(sn.data.action.id === computedActions[snIndex].id)
                sn.data.action.nestingLevel = computedActions[snIndex].nestingLevel

            return sn;
        });

        console.log({computedNodes});

        const withoutDraggedNode = nodesCopy.filter(n => n.id !== draggedNode[0].id);
        const target = withoutDraggedNode[startIndex + 1];

        const newGreenEdges = createGreenEdgesBetween(computedNodes, intNode, draggedNode[0], target);
        console.log("createGreenEdgesBetween -> newGreenEdges: ", newGreenEdges);

        const newRedEdges = actionsToRedEdges(computedNodes);
        console.log("newRedEdges: ", JSON.parse(JSON.stringify(newRedEdges)));

        const remainingEdges = edges
            .filter(e => e.animated !== true)
            .filter(e => e.id !== `e${intNode.id}-${target?.id}`)
            .filter(e => e.data.isRedEdge !== true);
        setEdges([...remainingEdges, ...newGreenEdges, ...newRedEdges]);

        //NODES
        setNodes(
            splicedNodes.map((n, index) => {
                if(computedActions[index].id !== n.data.action.id){
                    console.error("computedActions[index].id !== n.data.action.id at index: ", index, "for node: ", n);
                }

                const v_dist = 100;
                const h_dist = 200;
                const nest_level = computedActions[index].nestingLevel;
                const x = 
                    index === 0 
                        ? 0 
                        // : n.data.action.actionType === "END" 
                        //     ? n.data.action.nestingLevel + 1 * h_dist
                        : nest_level * h_dist;
                const y = Math.abs(index * v_dist);

                delete n.selected;
                delete n.dragging;
                delete n.width;
                delete n.height;
                delete n.positionAbsolute;

                n.position = { x, y };

                return n;
            })
        );

        setIntNode(null);
        setNodesBeforeDrag(null);
    },
    [
        draggedNodeRestore,
        setNodes,
        setEdges,
        nodes,
        edges,
        intNode,
        setIntNode,
        setIsFlowDragging,
        actionsToFlowWithNullItems,
        nodesBeforeDrag,
        setNodesBeforeDrag,
    ]);

    useEffect(() => {
        console.log("useEffect nodes: ", nodes);
        console.log("useEffect edges: ", edges);
    }, [nodes, edges]);

    useEffect(()=>{
        window.oncontextmenu = function (){
            console.log("window.oncontextmenu");

            if (!draggedNodeRestore.current)
                return false;

            setNodes(draggedNodeRestore.current.nodes);
            setEdges(draggedNodeRestore.current.edges);
            draggedNodeRestore.current = null;

            return false;
        };
    },[isFlowDragging]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                // onInit={(instance)=>{}}
                nodes={nodes}
                edges={edges}

                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}

                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}

                // onSelectionDragStart={onSelectionDragStart}
                // onSelectionDrag={onSelectionDrag}
                // onSelectionDragStop={onSelectionDragStop}

                // onSelectionChange={({ nodes, edges } : { nodes: Node[]; edges: Edge[]; }) => console.log("onSelectionChange, Nodes: ", nodes, ", Edges: ", edges)}

                // onConnect={onConnect}
                proOptions={proOptions}
                nodeTypes={nodeType}
                edgeTypes={edgeType}
                // snapToGrid
                elevateEdgesOnSelect={true}
                fitView
            >
                <Controls />
                {/*<MiniMap />*/}
                <Panel position="top-right">
                    {false && <div  style={{opacity: 0.7, display: 'flex', gap: 2, backgroundColor: 'white', border: '1px solid brown', padding: 2}}>
                                            <div style={{fontSize: '0.78rem', backgroundColor: 'green', padding: 5}}>
                                                <div>NODES</div>
                                                {
                                                    nodes.map(n => (
                                                            <div style={{display: 'flex', gap: 10}}>
                                                                <div>{n.id}</div>
                                                                <div>{n.data.action.actionType}</div>
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </div>
                    
                                            <div style={{fontSize: '0.78rem', backgroundColor: 'brown', padding: 5}}>
                                                <div>EDGES</div>
                                                {
                                                    edges.map((e, index) => (
                                                        <div style={{display: 'flex', gap: 3}}>
                                                            <div>{index}</div>
                                                            
                                                            <div>id({e.id})</div>
                                                            
                                                            <div>[(s-{e.source}), (t-{e.target})]</div>
                                                            
                                                            <div>a:{JSON.stringify(e.animated ? 'T' : 'F')}</div>
                    
                                                            <div>o:{JSON.stringify(e.data.offset ? e.data.offset : "-")}</div>
                                                        </div>)
                                                    )
                                                }
                                            </div>
                                        </div>}
                </Panel>
                <Background gap={12} size={1} />

                {/*<SelectionTest />*/}
            </ReactFlow>
        </div>
    );
}

export default function Main() {
    return (
        <ReactFlowProvider>
            <ActionsView />
        </ReactFlowProvider>
    );
}