import { TabAction } from "../Types/ActionTypes/Tab Actions";

export default function TabActions({
  action,
  dispatch,
}: {
  action: TabAction;
  dispatch: any;
}) {
  return (
    <div className="flex-column">
      <div className="fs-md">URL</div>
      <div className="flex-row align-center">
        <input
          id={action.url}
          className="flex-1"
          type="text"
          placeholder="url"
          value={action.url}
        />
      </div>
    </div>
  );
}

function debounce(fn, ms) {
  let timer;
  return function () {
    clearTimeout(timer);
    const context = this;
    const args = arguments;

    timer = setTimeout(function () {
      timer = null;
      fn.apply(context, args);
    }, ms);
  };
}
