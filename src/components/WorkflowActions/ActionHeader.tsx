function ActionHeader({ action, animateControl }) {
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

  function handleAnimate(control){
    control.set("hidden");
    control.start("visible");
  }

  return (
    <div
      className="action-header gap-1" 
      onClick={toggleActionDetails}
      // onClick={() => handleAnimate(animateControl)}
    >
      {/* <input id={action.id} type="checkbox" onClick={(e) => e.stopPropagation()} /> */}
      <div className="flex-row align-center justify-start gap-1 caption">
        <div className="flex-row align-center justify-center"> {action.svg()} </div>
        <div className="name">{action.actionType}</div>
        {
          action?.recorded  
            &&
          <div className="recorded-marker">REC</div>
        }
      </div>
    </div>
  );
}

export default ActionHeader;