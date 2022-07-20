import { useState } from "react";
import React from "react";
import { useLogin } from "../../hooks/useLogin";
//styles
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, Setpassword] = useState("");
  // Get the login function from the useLogin Hook
  const { login, isPending, error } = useLogin();
  /**
   * Handler function for login form submission.
   * @param {Event} e 
   */
  const handleSubmit = (e) => {
    // prevent default page refresh behavious
    e.preventDefault();
    // login user with the email and password values
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm}>
      <h2>Login</h2>
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
      {!isPending && <button className="btn"> Login</button>}
      {isPending && (
        <button className="btn" disabled>
          Loading
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}
