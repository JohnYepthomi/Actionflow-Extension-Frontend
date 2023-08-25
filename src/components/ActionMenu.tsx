import { InteractionDefinitions } from "../ActionsDefinitions/definitions";
import React, { useState, memo, useEffect } from "react";

type TMenuCategory = {
  title: String;
  actionDefintions: any; // needs narrowing
  type: "Interaction" | "Conditionals" | "TabActions" | "Sheet";
  dispatch: any;
};

function MenuCategory({
  title,
  actionDefintions,
  type,
  dispatch,
}: TMenuCategory) {
  const handleActionClick = React.useCallback((item) => {
    switch (type) {
      case "Interaction":
        dispatch({ type: "INTERACTION", item });
        break;
      case "Conditionals":
        dispatch({ type: "CONDITIONALS", item });
        break;
      case "TabActions":
        dispatch({ type: "TAB_ACTIONS", item });
        break;
      case "Sheet":
        dispatch({ type: "NEW_SHEET", item });
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className="w-100 flex-column align-center justify-center">
      <div className="action-title">{title}</div>
      <ul className="interaction-items flex-row align-center justify-center gap-1">
        {actionDefintions &&
          actionDefintions.map((item, index) => {
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

const ActionMenu = ({ dispatch }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleActionMenu = React.useCallback(
    (e) => {
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
        !!(
          elem.offsetWidth ||
          elem.offsetHeight ||
          elem.getClientRects().length
        );
      const outsideClickListener = (event) => {
        const containsTarget = !menuParentElement.contains(event.target);
        const MenuVisible = isVisible(menuParentElement);

        if (containsTarget && MenuVisible) {
          menuParentElement.style = "left: -300px";
          setOpenMenu((state) => (state = false));
          removeClickListener();
        }
      };
      const removeClickListener = () => {
        document.removeEventListener("click", outsideClickListener);
      };

      document.addEventListener("click", outsideClickListener);
    },
    [openMenu]
  );

  console.log("ActionMenu Rendered");

  return (
    <ul
      className="actions-list flex-column align-center justify-center"
      onClick={handleActionMenu}
    >
      <li>
        <MenuCategory
          title="PAGE INTERACTIONS"
          actionDefintions={InteractionDefinitions.filter(
            (a) =>
              ![
                "IF",
                "END",
                "Navigate",
                "NewTab",
                "SelectTab",
                "CloseTab",
              ].includes(a.name)
          )}
          type="Interaction"
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="SPREADSHEET"
          actionDefintions={[{ name: "Sheet", svg: () => "sheet svg" }]}
          type="Sheet"
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="CONDITIONALS"
          actionDefintions={InteractionDefinitions.filter((a) =>
            ["IF", "END"].includes(a.name)
          )}
          type="Conditionals"
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="TAB ACTIONS"
          actionDefintions={InteractionDefinitions.filter((a) =>
            ["Navigate", "NewTab", "SelectTab", "CloseTab"].includes(a.name)
          )}
          type="TabActions"
          dispatch={dispatch}
        />
      </li>
    </ul>
  );
};

export default memo(ActionMenu);
