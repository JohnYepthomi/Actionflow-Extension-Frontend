import "../styles/actions-menu.css";
import { InteractionDefintions } from "../ActionsDefinitions/definitions";
import { useState } from "react";
import GlobeIcon from "../assets/globe";

function MenuCategory({ title, items, type, dispatch }) {
  function handleActionClick(item) {
    if (type === "Interaction") dispatch({ type: "INTERACTION", item });
    else if (type === "Conditionals") dispatch({ type: "CONDITIONALS", item });
    else if(type === "TabActions") dispatch({ type: "TAB_ACTIONS", item });
  }

  return (
    <div className="w-100 flex-column align-center justify-center">
      <div className="action-title">{title}</div>
      <ul className="interaction-items flex-row align-center justify-center gap-1">
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

const NewTabIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-window-stack" viewBox="0 0 16 16">
  <path d="M4.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM6 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"/>
  <path d="M12 1a2 2 0 0 1 2 2 2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10ZM2 12V5a2 2 0 0 1 2-2h9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1Zm1-4v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8H3Zm12-1V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2h12Z"/>
</svg>;

const SelectTabIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-square-half" viewBox="0 0 16 16">
  <path d="M8 15V1h6a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8zm6 1a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12z"/>
</svg>;

const CloseTabIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>;

export default function ActionMenu({ dispatch }) {
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
    {
      name: "END",
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
    <ul
      className="actions-list flex-column align-center justify-center"
      onClick={handleActionMenu}
    >
      <li>
        <MenuCategory
          title="PAGE INTERACTIONS"
          items={InteractionDefintions}
          type="Interaction"
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="CONDITIONALS"
          items={ConditionItems}
          type="Conditionals"
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="TAB ACTIONS"
          items={[
            { name: "Navigate", svg: GlobeIcon },
            { name: "NewTab", svg: NewTabIcon },
            { name: "SelectTab", svg: SelectTabIcon },
            { name: "CloseTab", svg: CloseTabIcon },
          ]}
          type="TabActions"
          dispatch={dispatch}
        />
      </li>
    </ul>
  );
}
