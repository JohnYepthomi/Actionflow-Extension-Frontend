import { useCallback, useState } from "react";
import { Icon, Center } from '@chakra-ui/react';

import { SiScrollreveal } from "react-icons/si";
import { PiCursorClick } from "react-icons/pi";
import { TiInfoOutline } from "react-icons/ti";
import { PiArrowCircleDownLeftLight } from "react-icons/pi";
import { VscListSelection } from "react-icons/vsc";
import { RiKeyboardFill } from "react-icons/ri";
import { CiCalendarDate } from "react-icons/ci";
import { HiCloudArrowUp } from "react-icons/hi2";
import { FaRegFileCode } from "react-icons/fa";
import { IoList } from "react-icons/io5";
import { TbMist } from "react-icons/tb";
import { BsSticky } from "react-icons/bs";
import { LuLink } from "react-icons/lu";
import { RiAnchorLine } from "react-icons/ri";
import { MdOutlineTypeSpecimen } from "react-icons/md";
import { PiTabsFill } from "react-icons/pi";
import { FcDataSheet } from "react-icons/fc";
import { GiLogicGateNor } from "react-icons/gi";
import { BsAlignEnd } from "react-icons/bs";
import { LiaGlobeEuropeSolid } from "react-icons/lia";

function CustomIcon({ actionName, icon }){
	return (
		<Center minW={8} maxW={8} w={8} border="1px solid white" h={8} borderRadius="3" style={{ rotate: ["END", "IF"].includes(actionName) ? "90deg" : "0deg" }}>
			<Icon boxSize={7} sx={{color: 'white !important' }} as={icon} />
		</Center>
	)
}

const ActionsToIcons = {
    "Click": PiCursorClick,
    "Scroll": SiScrollreveal,
    "Prompts": TiInfoOutline,
    "Hover": PiArrowCircleDownLeftLight,
    "Select": VscListSelection,
    "Keypress": RiKeyboardFill,
    "Date": CiCalendarDate,
    "Upload": HiCloudArrowUp,
    "Code": FaRegFileCode,
    "List": IoList,
    "Text": TbMist,
    "Attribute": BsSticky,
    "Anchor": RiAnchorLine,
    "URL": LuLink,
    "NewTab": PiTabsFill,
    "Type": MdOutlineTypeSpecimen,
    "Sheet": FcDataSheet,
    "IF": GiLogicGateNor,
    "END": BsAlignEnd,
    "Navigate": LiaGlobeEuropeSolid
};

export default function ActionIcon({actionName}) {
	return <CustomIcon actionName={actionName} icon={ActionsToIcons[actionName]} />
}
