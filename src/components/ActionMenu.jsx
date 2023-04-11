import '../styles/actions-menu.css';
import { Interactions } from '../ActionsDefinitions/definitions';

function ActionMenuCategory({title, items, setAction}){
	
	function handleActionClick(item){
		setAction(state => [...state, {name: item.name, svg: item.svg, actionType: "interaction"}]);
	}

	return (
		<div>
			<div className="action-title">{ title }</div>
			<ul className="interaction-items">
				{
				  items && items.map((item, index) => {
				  	return (
					  	<li key={index} onClick={() => handleActionClick(item)}>
							{item.svg()}
							<div>{item.name}</div>
						</li>
					);
				  })
				}
			</ul>
		</div>
	);
}

export default function ActionMenu({setAction}){

	return (
		<ul className="actions-list">
			<li>
				<ActionMenuCategory
					title="PAGE INTERACTIONS"
					items={Interactions}
					setAction={setAction}
				/>
			</li>
		</ul>
	);	
}