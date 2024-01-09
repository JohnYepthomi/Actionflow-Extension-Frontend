export default function Debounce(fn: any, ms: any) {
  let timer: number | undefined;
  return function () {
    // console.log("timerId: ", timer);
    clearTimeout(timer);
    const context = Debounce;
    const args = arguments;

    timer = setTimeout(function () {
      console.log("Actually dispatching event to State machine", args);
      timer = undefined;
      fn.apply(context, args);
    }, ms);
  };
}