import React from 'react'
import styles from './Home.module.css'
import placeholder from '../../assets/969696.png'
import { useFirestore } from '../../hooks/useFirestore'

export default function BeanList({ beans }) {
  const { deleteDocument } = useFirestore("beans")

 const handleDelete = (beanId) => {
  deleteDocument(beanId)
 }

  return (
    <div>
      
      <div className={styles.beanList}>
        {beans.map((bean) => (
          <div key={bean.id} className={styles.beanCard}>
            <img className={styles.beanCardImg} src={bean.image ? bean.image : placeholder} alt={bean.name}></img>
            
              <p className={styles.beanCardTitle}> {bean.name}</p>
              <div className={styles.beanDetails}>
              {/**<p className={styles.beanCardSubTitle}>&#9881;</p>*/}
              <p className={styles.beanCardContent}>&#9201; {bean.grinderDuration} sec</p>
              
              <p className={styles.beanCardContent}> @ setting {bean.grinderSetting}</p>
              </div>
              <p className={styles.beanCardNotes}>{bean.notes} </p>
            
            <button onClick={() => handleDelete(bean.id)}>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}
