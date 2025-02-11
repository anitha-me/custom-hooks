import { useState, useEffect } from "react";

/**
 * Hook: useNetworkStatus
 *
 * @description To get the network status
 * @returns the status value
 */
export const useNetworkStatus = () => {
  const [status, setStatus] = useState(true);

  function handleOnline() {
    setStatus(true);
  }

  function handleOffline() {
    setStatus(false);
    window.alert("No internet !!!");
  }

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return status;
};
