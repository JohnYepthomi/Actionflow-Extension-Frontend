function ActionHeader({action}) {
  function toggleActionDetails(e) {
    // e.preventDefault();

    if (!e.currentTarget.classList.contains("action-header")) return;

    const actionHeaderEl = e.currentTarget;
    const actionDetailsEl =
      actionHeaderEl.parentElement.querySelector(".action-details");
    const display = actionDetailsEl.style.display;
    if (display === "" || display === "flex") {
      actionDetailsEl.style.display = "none";
    } else {
      actionDetailsEl.style.display = "flex";
    }
  }

  return (
    <div
      className="action-header gap-1" 
      onClick={toggleActionDetails}
    >
      <input
        type="checkbox"
        id="accept"
        name="accept"
        value="yes"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-row align-center justify-start gap-1 caption">
        <div className="flex-row align-center justify-center">
         {action.svg()}
        </div>
        <div className="name">{action.actionType}</div>
        {action?.recorded && <div className="recorded-marker">REC</div>}
      </div>
    </div>
  );
}

export default ActionHeader;