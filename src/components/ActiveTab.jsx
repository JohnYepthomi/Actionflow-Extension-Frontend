import "../styles/activetab.css";

export default function ActiveTab({ currentTab }) {
  return (
    <div className="flex-row align-center justify-center gap-1">
      <div className="activetab-label fw-bold p-1">Active Tab</div>

      <div className="flex-row align-center -justify-center gap-1 p-1">
        <img
          src={currentTab.icon}
          alt="Active Tab favicon"
          width="15px"
          height="15px"
        />
        <div className="activetab-title fw-bold">{currentTab.title}</div>
      </div>
    </div>
  );
}
