import { useCallback, useEffect, useRef, useState } from 'react';

export default function TabActions({ action, dispatch }){
	return (
		<div className="flex-column">
			<div className="fw-bold txt-clr fs-md">URL</div>
			<div className="flex-row align-center">
				<input id={action.url} className="flex-1" type="text" placeholder="url" value={action.url}/>
			</div>
		</div>
	);
}

function debounce(fn, ms) {
  let timer;
  return function() {
    clearTimeout(timer);
    const context = this;
    const args = arguments;

    timer = setTimeout(function() {
      timer = null;
      fn.apply(context, args);
    }, ms);
  };
}
