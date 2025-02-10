import { useState, useEffect } from "react";

/**
 * Hook: useFindVisibleElements
 * @description This is to find the elements which are in the bottom half of the viewport or not.
 *
 * @param elementRefs an array of elements which we want to listen.
 * @returns an array of elements which are in the bottom half of the viewport.
 */
export function useFindVisibleElements(elementRefs: any) {
  const [visibleElementIds, setVisibleElementIds] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const newVisibleElementIds: any[] = [];

      elementRefs.current &&
        elementRefs.current.forEach((elementRef: any) => {
          if (elementRef && elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            const isInViewport =
              rect.top < window.innerHeight / 2 && rect.top > 0;

            if (isInViewport) {
              newVisibleElementIds.push(elementRef.current.id);
            }
          }
        });

      setVisibleElementIds(newVisibleElementIds);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [elementRefs]);

  return visibleElementIds;
}
