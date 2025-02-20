import { useEffect, useState } from 'react';

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
  scope = '', // can also authorize specific scopes (add them in url)
  successCallback,
}: Props) => {
  const [isSignIn, setIsSignIn] = useState<boolean>(false);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      try {
        // TODO: Handle sign event data
        console.log(event);

        successCallback && (await successCallback());
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [successCallback]);

  /**
   * Get auth URL.
   */
  const initOauth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/');
      window.open(res.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // TODO: Condition to check if user is logged in or not
    // and update setIsSignIn state
    setIsSignIn(true);
  }, []);

  return { isSignIn, initOauth };
};
