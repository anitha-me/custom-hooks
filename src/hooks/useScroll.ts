import { useEffect, useState, useCallback } from "react";

/**
 * Hook: useScroll
 * @description To determine the scroll position of Y on the scroll event.
 *
 * @returns the Y scroll position.
 */
export function useScroll() {
  const [scrollY, setScrollY] = useState(0);

  const onScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return scrollY;
}
