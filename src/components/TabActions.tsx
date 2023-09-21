import { TTabsAction } from "../Schemas/replaceTypes/Actions";

type TabActionParams = {
  action: TTabsAction;
  dispatch: any;
};
export default function TabActions({ action, dispatch }: TabActionParams) {
  return (
    <div className="flex-column">
      <div className="fs-md">URL</div>
      <div className="flex-row align-center">
        <input
          id={action.props.url}
          className="flex-1"
          type="text"
          placeholder="url"
          value={action.props.url}
        />
      </div>
    </div>
  );
}

function debounce(fn: any, ms: any) {
  let timer: number | undefined;
  return function () {
    clearTimeout(timer);
    const context = debounce;
    const args = arguments;

    timer = setTimeout(function () {
      timer = undefined;
      fn.apply(context, args);
    }, ms);
  };
}
