import React from "react";
import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
//styles
import styles from "./Signup.module.css";

/**
 * Component for user sign up page
 */
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, Setpassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  //get the signup function from useSignup hook
  const { signup, isPending, error } = useSignup();

  /**
   * Handler function for sign up form submission
   * @param {Event} e
   */
  const handleSubmit = (e) => {
    // prevent default page refresh behaviour
    e.preventDefault();
    // signup user (useSignup hook)
    signup(email, password, displayName);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.signupForm}>
      <h2>Signup</h2>
      <label>
        <span>email:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          type="password"
          onChange={(e) => Setpassword(e.target.value)}
          value={password}
        />
      </label>
      <label>
        <span>display name:</span>
        <input
          type="text"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
      </label>
      {!isPending && <button className="btn">Signup</button>}
      {isPending && (
        <button className="btn" disabled>
          loading
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}
