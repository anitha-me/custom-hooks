import { useMediaQuery } from "./useMediaQuery";

/**
 * Hook: useBreakpoints
 * @description This hook is to detect the breakpoints are active or not.
 *
 * @returns the set of boolean values for each breakpoint.
 */
export function useBreakpoints() {
  const breakpoints = {
    isXs: useMediaQuery("(max-width: 640px)"),
    isSm: useMediaQuery("(min-width: 640px) and (max-width: 767px)"),
    isMd: useMediaQuery("(min-width: 768px) and (max-width: 1023px)"),
    isLg: useMediaQuery("(min-width: 1024px) and (max-width: 1279px"),
    isXl: useMediaQuery("(min-width: 1280px)"),
    active: "xs",
  };

  if (breakpoints.isXs) breakpoints.active = "xs";
  if (breakpoints.isSm) breakpoints.active = "sm";
  if (breakpoints.isMd) breakpoints.active = "md";
  if (breakpoints.isLg) breakpoints.active = "lg";
  if (breakpoints.isXl) breakpoints.active = "xl";
  return breakpoints;
}
