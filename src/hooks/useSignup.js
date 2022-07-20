import { useState, useEffect } from "react";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

/**
 * Custom hook to signup a new user using Firebase auth
 * Accepts email, password, diplay name from user
 * @returns Function to signup new user and error/pending state
 */
export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  // Get the dispatch method from the useAuthContext hook for updating the auth context
  const { dispatch } = useAuthContext();

  /**
   * Function to sign up a new user using firebase auth
   * @param {string} email New user's email address
   * @param {string} password New user's password
   * @param {string} displayName New user's display name
   */
  const signup = async (email, password, displayName) => {
    // Reset error state and set pending to true
    setError(null);
    setIsPending(true);

    try {
      /** Sign up user using firebase auth and store the response in a variable
       * This only takes email and password
       */
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      // if there is no response, throw an error
      if (!res) {
        throw new Error("could not complete signup");
      }
      // update the new user with their display name
      await res.user.updateProfile({ displayName: displayName });
      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });
      //update state if the component is still mounted
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      //update state if the component is still mounted
      if (!isCancelled) {
        console.log(err.message);
        setIsPending(false);
        setError(null);
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

  return { error, isPending, signup };
};
