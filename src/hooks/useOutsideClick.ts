import { useEffect } from "react";

/**
 * Hook: useOutsideClick
 * @description This is to detect any click that happen outside the given element (ref).
 * If so, the given callback handler is called.
 *
 * @param ref element which want to listen for the outside click
 * @param callback function to be called when the click happens outside
 * @param exceptRef to exclude any elements, where the callback doesn't work
 */
export function useOutsideClick(ref: any, callback: any, exceptRef?: any) {
  const documentDidClick = (event: any) => {
    const node = ref && ref.current;

    if (
      node &&
      !node.contains(event.target) &&
      !exceptRef?.current?.contains(event.target)
    ) {
      callback(event);
    }
  };

  // Can you window object as well
  useEffect(() => {
    document.addEventListener("click", documentDidClick);

    return () => {
      document.removeEventListener("click", documentDidClick);
    };
  }, [ref, callback]);
}
