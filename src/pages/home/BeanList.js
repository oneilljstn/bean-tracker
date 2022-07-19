import React from "react";
import styles from "./Home.module.css";
import placeholder from "../../assets/969696.png";
import { useFirestore } from "../../hooks/useFirestore";

export default function BeanList({ beans, query }) {
  const { deleteDocument } = useFirestore("beans");

  const handleDelete = (beanId) => {
    deleteDocument(beanId);
  };

  const filteredBeans = beans.filter((bean) => {
    // if the query string is empty show all beans
    if (query === ""){
      return true
    }
    //otherwise only show beans with matching titles
    if (query !== '') {
      return bean.name.toLowerCase().match(query.toLowerCase());
    } 
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
                &#9201; {bean.grinderDuration} seconds @ setting {bean.grinderSetting}
              </p>
            </div>
            <p className={styles.beanCardNotes}>{bean.notes && bean.notes.substring(0,200)} </p>

            <button onClick={() => handleDelete(bean.id)}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}
