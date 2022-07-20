import styles from "./Home.module.css";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";

import React, { useState } from "react";
import AddBeanForm from "./AddBeanForm";
import BeanList from "./BeanList";

/**
 * Main page for logged in users.
 * Shows the users's beans and form for adding new beans
 */
export default function Home() {
  const [query, setQuery] = useState("");
  // Get the user from the Auth context 
  const { user } = useAuthContext();
  // get all documents from the beans collection that the current user added. Sort by created date.
  const { documents, error } = useCollection(
    "beans",
    ["userId", "==", user.uid],
    ["createdAt", "desc"]
  );

  /**
   * Handler function to make sure the filter/search box doesn't refresh the page. 
   * The filter feature works without form submission
   * @param {Event} e 
   */
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <form onSubmit={handleSearch} className={styles.search}>
        <input
          type="search"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          placeholder="Search"
          required
        />
      </form>
      <div className={styles.container}>
        {<AddBeanForm uid={user.uid} />}

        <div className={styles.content}>
          {error && <p>{error}</p>}
          {documents && <BeanList beans={documents} query={query} />}
        </div>
      </div>
    </>
  );
}
