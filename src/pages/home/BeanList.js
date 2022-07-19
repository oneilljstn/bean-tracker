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
            <div className={styles.beanDetails}>
              <h1 className={styles.beanCardTitle}> {bean.name}</h1>
              <p className={styles.beanCardSubTitle}>Grinder</p>
              <p className={styles.beanCardContent}>Setting: {bean.grinderSetting}</p>
              <p className={styles.beanCardContent}>Duration: {bean.grinderDuration} sec</p>
            </div>
            <button onClick={() => handleDelete(bean.id)}>x</button>
          </div>
        ))}
      </div>
    </div>
  );
}
