import styles from './Home.module.css'

import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'

import React from 'react'
import AddBeanForm from './AddBeanForm'
import BeanList from './BeanList'



export default function Home() {

  const { user } = useAuthContext()
  const { documents, error } = useCollection(
    "beans",
    ["userId", "==", user.uid],
    ["createdAt", "desc"]
  )
 
 


  return (
    <div className={styles.container}>
      
      {<AddBeanForm  uid={user.uid}/>}
    
      <div className={styles.content}>
          {error && <p>{error}</p>}
          {documents && <BeanList beans={documents} />}
      </div>
      

    
    </div>
  )
}
