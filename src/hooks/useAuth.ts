import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import { getLocalStorageValue, setLocalStorageValue } from "./useLocalStorage";
import { Errors } from "../constants/errors";
import { useApiRequest } from "../lib/axios/useApiRequest";
import { getAuthorizationUrl } from "../repositories/login.repositories";
import { jwtDecode } from "../utils/login.utils";

interface Props {
  setIsLoading?: (loading: boolean) => void;
  scope?: string;
  successCallback?: () => void;
}
/**
 * To manage the logged in state.
 *
 * @returns {boolean} isSignIn
 */
export const useAuth = ({
  setIsLoading = () => {},
  scope: authScope = "",
  successCallback,
}: Props) => {
  const userData = getLocalStorageValue("user_data");
  const [isSignIn, setIsSignIn] = useState<boolean>(false);

  const { callApi: api_getAuthorizationUrl } = useApiRequest(
    getAuthorizationUrl,
    false
  );

  // Handle the Oauth event listener.
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (
        event.origin == process.env.VITE_ORIGIN &&
        event.data.includes("id_token")
      ) {
        setIsLoading(true);

        const {
          id_token: idToken,
          app_oauth_id: appOauthId,
          access_token: accessToken,
        } = JSON.parse(event.data);
        const data = jwtDecode(idToken);

        try {
          const sessionId = uuidv4();

          setLocalStorageValue("user_data", {
            ...data,
            idToken,
            sessionId,
            appOauthId,
            accessToken,
          });

          successCallback && (await successCallback());
        } catch (err) {
          toast.error(Errors.Authorize);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [successCallback]);

  /**
   * Get auth URL.
   */
  const initOauth = async () => {
    setIsLoading(true);
    try {
      const res = await api_getAuthorizationUrl("google", authScope);
      window.open(res.url);
    } catch (err) {
      toast.error(Errors.Authorize);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.idToken) {
      setIsSignIn(true);
    }
  }, [userData]);

  return { isSignIn, initOauth };
};
