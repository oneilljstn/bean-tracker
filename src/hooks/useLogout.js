import { useState, useEffect } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

/**
 * Custom hook to log out user
 * @returns A function to logout user as well as error/pending state
 */
export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  // Get the dispatch method from the useAuthContext hook for updating the auth context
  const { dispatch } = useAuthContext();

  /**
   * Function to log out user using Firebase
   */
  const logout = async () => {
    // Reset error state and set pending to true
    setError(null);
    setIsPending(true);
    try {
      // Sign out user
      await projectAuth.signOut();
      //dispatch logout action to update auth context
      dispatch({ type: "LOGOUT" });

      //update state if the component is still mounted
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      //update state for error only if the component is still mounted
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    /**
     * cleanup function to ensure state is not updated once the component is unmounted
     * The useEffect callback function is fired when the component is unmounted.
     * isCancelled is set to true and stops all future state changes
     * */
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
