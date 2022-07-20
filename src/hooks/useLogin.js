import { useState, useEffect } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

/**
 * Custom hook to log users in using firebase auth
 * @returns function to login user as well as error/pending states
 */
export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // Get the dispatch method from the useAuthContext hook for updating the auth context
  const { dispatch } = useAuthContext();

  /**
   * function to login user using Firebase
   * @param {string} email - User's email address
   * @param {string} password - User's password
   */
  const login = async (email, password) => {
    // Reset error state and set pending to true
    setError(null);
    setIsPending(true);
    try {
      // Sign user in and store the response in variable
      const response = await projectAuth.signInWithEmailAndPassword(email, password);
      //dispatch login action to update the auth context
      dispatch({ type: "LOGIN", payload: response.user });
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

  return { login, error, isPending };
};
