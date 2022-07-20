import React from "react";
import styles from "./Home.module.css";
import placeholder from "../../assets/969696.png";
import { useFirestore } from "../../hooks/useFirestore";

/**
 * Component to render a series of cards. One for each bean in the beans prop.
 * @param {Object[]} beans An array of objects. Each object represents on bean.
 * @param {string} beans[].id Unique id of the bean document
 * @param {string} beans[].name name of the bean
 * @param {string} beans[].image url to the image of the bean
 * @param {string} beans[].grinderDuration  grind duration (seconds)
 * @param {string} beans[].grinderSetting grinder setting (number)
 * @param {string} beans[].notes  any notes associated with the bean
 * @param {string} [query] A query string used to filter the array of beans
 * @returns
 */
export default function BeanList({ beans, query }) {
  // Get the deleteDocument function from useFirestore hook
  const { deleteDocument } = useFirestore("beans");

  /**
   * Function fires when user clicks the delete button on a bean card
   * @param {string} beanId ID of the bean document to be deleted from Firestore
   */
  const handleDelete = (beanId) => {
    deleteDocument(beanId);
  };

  // Create a new array of beans based on the query prop
  const filteredBeans = beans.filter((bean) => {
    // if the query string is empty show all beans
    if (query === "") {
      return true;
    }
    //otherwise only show beans with matching titles
    if (query !== "") {
      return bean.name.toLowerCase().match(query.toLowerCase());
    }
    // else don't return the bean
    return false;
  });

  return (
    <div>
      <div className={styles.beanList}>
        {filteredBeans.map((bean) => (
          <div key={bean.id} className={styles.beanCard}>
            <img
              className={styles.beanCardImg}
              src={bean.image ? bean.image : placeholder}
              alt={bean.name}
            ></img>
            <p className={styles.beanCardTitle}> {bean.name}</p>
            <div className={styles.beanDetails}>
              <p className={styles.beanCardContent}>
                &#9201; {bean.grinderDuration} seconds @ setting{" "}
                {bean.grinderSetting}
              </p>
            </div>
            <p className={styles.beanCardNotes}>
              {bean.notes && bean.notes.substring(0, 200)}{" "}
            </p>
            <button onClick={() => handleDelete(bean.id)}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}
