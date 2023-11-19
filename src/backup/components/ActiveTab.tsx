import GlobeIcon from "../assets/globe";

type ActiveTabParams = { current: any };
export default function ActiveTab({ current }: ActiveTabParams) {
  const { activeTab } = current.context;

  if (activeTab)
    return (
      <div className="active-tab-container flex-row align-center justify-center gap-1">
        {/* <div className="activetab-label fw-bold p-1">Active Tab</div> */}
        <div className="flex-row align-center -justify-center gap-1 p-2">
          {activeTab?.icon ? (
            <img
              src={activeTab.icon}
              alt="Active Tab favicon"
              width="15px"
              height="15px"
            />
          ) : (
            <GlobeIcon />
          )}
          <div className="activetab-title">
            {activeTab?.title ? activeTab.title : "No Active Tab"}
          </div>
        </div>
      </div>
    );
  else return <></>;
}
