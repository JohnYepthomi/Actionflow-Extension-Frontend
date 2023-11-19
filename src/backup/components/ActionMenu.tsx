import { InteractionDefinitions } from "../ActionsDefinitions/definitions";
import React, { useState, memo, ReactNode } from "react";
import { TAppEvents } from "../Schemas/replaceTypes/StateEvents";

type TMenuCategory = {
  title: String;
  actionDefintions: any; // needs narrowing
  dispatch: any;
};

function MenuCategory({ title, actionDefintions, dispatch }: TMenuCategory) {
  const handleActionClick = React.useCallback(
    (item: { name: string; svg: () => ReactNode }) => {
      dispatch({
        type: "CREATE_ACTION",
        payload: {
          actionType: item.name,
        },
      } satisfies TAppEvents);
    },
    []
  );

  return (
    <div className="w-100 flex-column align-center justify-center">
      <div className="action-title">{title}</div>
      <ul className="interaction-items flex-row align-center justify-center gap-1">
        {actionDefintions &&
          actionDefintions.map(
            (item: { name: string; svg: () => ReactNode }, index: number) => {
              return (
                <li key={index} onClick={() => handleActionClick(item)}>
                  {item.svg()}
                  <div>{item.name}</div>
                </li>
              );
            }
          )}
      </ul>
    </div>
  );
}

type ActionMenuParams = { dispatch: any };
const ActionMenu = ({ dispatch }: ActionMenuParams) => {
  const [openMenu, setOpenMenu] = useState(false);

  const handleActionMenu = React.useCallback(
    (e: any) => {
      const menuParentElement = e.currentTarget;
      if (!openMenu) {
        menuParentElement.style = "left: 0px; ";
        setOpenMenu((state) => (state = true));
      } else {
        menuParentElement.style = "left: -300px;";
        setOpenMenu((state) => (state = false));
      }

      const isVisible = (elem: HTMLElement) =>
        !!elem &&
        !!(
          elem.offsetWidth ||
          elem.offsetHeight ||
          elem.getClientRects().length
        );
      const outsideClickListener = (event: any) => {
        const containsTarget = !menuParentElement.contains(event.target);
        const MenuVisible = isVisible(menuParentElement);

        if (containsTarget && MenuVisible) {
          menuParentElement.style = "left: -300px";
          setOpenMenu((state) => (state = false));
          removeClickListener();
        }
      };
      const removeClickListener = () => {
        menuParentElement.removeEventListener("click", outsideClickListener);
      };

      menuParentElement.addEventListener("click", outsideClickListener);
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
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="SPREADSHEET"
          actionDefintions={[{ name: "Sheet", svg: () => "sheet svg" }]}
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="CONDITIONALS"
          actionDefintions={InteractionDefinitions.filter((a) =>
            ["IF", "WHILE", "END", "ELSE"].includes(a.name)
          )}
          dispatch={dispatch}
        />
      </li>

      <li>
        <MenuCategory
          title="TAB ACTIONS"
          actionDefintions={InteractionDefinitions.filter((a) =>
            ["Navigate", "NewTab", "SelectTab", "CloseTab"].includes(a.name)
          )}
          dispatch={dispatch}
        />
      </li>
    </ul>
  );
};

export default memo(ActionMenu);
