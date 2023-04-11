import Editor from './Editor.jsx';
import '../styles/interactions.css';

function Common({ actionProps }){
	return (
		<div className="common flex-column">
			<div className="fw-bold txt-clr">Selector</div>
			<div className="flex-row">
				<input className="flex-1" type="text" placholder="Css Selector" value={actionProps.selector}/>
				<button className="button-60">Pick</button>
			</div>
		</div>
	);
}

function Scroll(){
	return (
		<div className="flex-column mt">
			<div className="fw-bold txt-clr">Scroll Direction</div>
			<select>
			    <option>Scroll Top</option>
			    <option>Scroll Bottom</option>
		    </select>
			<div className="flex-column mt">
				<label className="fw-bold txt-clr">Description</label>
				<input type="text" placeholder="Enter description" />
			</div>
		</div>
	);
}

function Click({ actionProps }){
	const prop1 = actionProps["Wait for New Page to Load"];
	const prop2 = actionProps["Wait for file Download"];
	return (
		<div className="flex-column mt">
			<div className="flex-row">
				<input type="checkbox" checked={ prop1 ? prop1 : false} />
				Wait for New Page to Load
			</div>
			<div className="flex-row">
				<input type="checkbox" checked={ prop2 ? prop2 : false} />
				Wait for file Download
			</div>
			<div className="flex-column mt">
				<label className="fw-bold txt-clr">Description (optional)</label>
				<input type="text" placeholder="Enter description" value={actionProps["Description"]} />
			</div>
		</div>
	);	
}

function Type({ actionProps }){
	return (
		<div className="flex-column mt">
			<div className="fw-bold txt-clr">Text</div>
			<input type="text" placeholder="Type Text" />
			<div className="flex-row">
				<input type="checkbox" />
				Overwrite Existing Text
			</div>
		</div>
	);	
}

function Hover({ actionProps }){
	return (
		<div className="flex-column mt">
			<div className="flex-column">
				<label className="fw-bold txt-clr">Description (Optional)</label>
				<input type="text" placeholder="Enter description" />
			</div>
		</div>
	);
}

function Keypress({ actionProps }){
	return (
		<div className="flex-column mt">
		    <div className="flex-column">
				<label className="fw-bold txt-clr">Key</label>
		    	<div className="flex-row">
					<input type="text" />
					<button>Detect</button>
		    	</div>
		    </div>
			<div className="flex-row">
				<input type="checkbox" />
				<div> Wait for new page to load</div>
			</div>
		</div>
	);
}

function Upload({ actionProps }){
	return (
		<div className="flex-column mt">
			<label className="fw-bold txt-clr">Path</label>
			<input type="text" placeholder="eg. /documents/file/names.txt" />
		</div>
	);
}

function Select({ actionProps }){
	return (
		<div className="flex-column mt">
			<div className="flex-column">
				<label className="fw-bold txt-clr">Value</label>
				<input type="text" />
			</div>
			<div className="flex-column">
				<label className="fw-bold txt-clr">Description</label>
				<input type="text" />
			</div>
		</div>
	);
}

function Date({ actionProps }){
	return (
		<div className="flex-column mt">
			<label className="fw-bold txt-clr">Date</label>
			<input type="text" />
		</div>
	);
}

function Prompts({ actionProps }){
	return (
		<div className="flex-column mt">
			<label className="fw-bold txt-clr">Response Type</label>
			<select>
				<option>Accept</option>
				<option>Decline</option>
			</select>
			<div className="flex-column mt">
				<div className="fw-bold">Response Text (Optional)</div>
				<input type="text" />
			</div>
		</div>
	);
}

function Code({ actionProps }){
	return <Editor />
}

export default function InteractionInfo({ actionName, actionProps }){
	return (
		<div className="action-details flex-column padding-all">
			{ ( !["Prompts", "Code"].includes(actionName))   &&  <Common   actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Code".toLowerCase())  					     &&  <Code     actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Type".toLowerCase())     					 &&  <Type     actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Date".toLowerCase())     					 &&  <Date     actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Click".toLowerCase())    					 &&  <Click    actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Hover".toLowerCase())    					 &&  <Hover    actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Scroll".toLowerCase())   				     &&  <Scroll   actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Upload".toLowerCase())   					 &&  <Upload   actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Select".toLowerCase())   					 &&  <Select   actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Prompts".toLowerCase())  					 &&  <Prompts  actionProps={actionProps}/>  }
			{ (actionName.toLowerCase() === "Keypress".toLowerCase()) 					 &&  <Keypress actionProps={actionProps}/>  }
		</div>
	);
}