import "../styles/actions-menu.css";
import {
  Interactions,
  ActionNodeProps,
} from "../ActionsDefinitions/definitions";
import { useState } from "react";

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

function ActionMenuCategory({ title, items, type, setActions }) {
  function handleActionClick(item) {
    let tempState = [];
    if (type === "Interactions") {
      const props = {
        Common: ActionNodeProps["Common"],
        [`${item.name}`]: ActionNodeProps[`${item.name}`],
      };
      tempState.push({
        id: guidGenerator(),
        name: item.name,
        svg: item.svg,
        actionType: type,
        props,
      });
    } else if (type === "Conditionals") {
      const InitialConditionOptions = {
        type: "Element",
        options: ["IsHidden", "IsVisible"],
      };
      tempState.push({
        id: guidGenerator(),
        name: item.name,
        svg: item.svg,
        actionType: type,
        conditions: [InitialConditionOptions],
      });
    }

    setActions((state) => [...state, ...tempState]);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        with: "100%",
      }}
    >
      <div className="action-title">{title}</div>
      <ul className="interaction-items">
        {items &&
          items.map((item, index) => {
            return (
              <li key={index} onClick={() => handleActionClick(item)}>
                {item.svg()}
                <div>{item.name}</div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default function ActionMenu({ setActions }) {
  const [openMenu, setOpenMenu] = useState(false);

  const ConditionItems = [
    {
      name: "IF",
      svg: () => (
        <svg
          height="16"
          fill="currentColor"
          viewBox="0 0 32 32"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m26 18a3.9955 3.9955 0 0 0 -3.858 3h-4.142a3.0033 3.0033 0 0 1 -3-3v-4a4.9514 4.9514 0 0 0 -1.0256-3h8.1676a4 4 0 1 0 0-2h-12.284a4 4 0 1 0 0 2h.142a3.0033 3.0033 0 0 1 3 3v4a5.0059 5.0059 0 0 0 5 5h4.142a3.9935 3.9935 0 1 0 3.858-5zm0-10a2 2 0 1 1 -2 2 2.0023 2.0023 0 0 1 2-2zm-20 4a2 2 0 1 1 2-2 2.002 2.002 0 0 1 -2 2zm20 12a2 2 0 1 1 2-2 2.0027 2.0027 0 0 1 -2 2z" />
          <path d="m0 0h32v32h-32z" fill="none" />
        </svg>
      ),
    },
  ];

  function handleActionMenu(e) {
    e.preventDefault();

    const menuParentElement = e.currentTarget;
    if (!openMenu) {
      menuParentElement.style = "left: 0px; ";
      setOpenMenu((state) => (state = true));
    } else {
      menuParentElement.style = "left: -300px;";
      setOpenMenu((state) => (state = false));
    }

    const isVisible = (elem) =>
      !!elem &&
      !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);

    const outsideClickListener = (event) => {
      if (
        !menuParentElement.contains(event.target) &&
        isVisible(menuParentElement)
      ) {
        menuParentElement.style = "left: -300px";
        setOpenMenu((state) => (state = false));
        removeClickListener();
      }
    };

    const removeClickListener = () => {
      document.removeEventListener("click", outsideClickListener);
    };

    document.addEventListener("click", outsideClickListener);
  }

  return (
    <ul className="actions-list" onClick={handleActionMenu}>
      <li>
        <ActionMenuCategory
          title="PAGE INTERACTIONS"
          items={Interactions}
          type="Interactions"
          setActions={setActions}
        />
      </li>
      <li>
        <ActionMenuCategory
          title="CONDITIONALS"
          items={ConditionItems}
          type="Conditionals"
          setActions={setActions}
        />
      </li>
    </ul>
  );
}
