import styles from './Home.module.css'

import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'

import React, { useState } from 'react'
import AddBeanForm from './AddBeanForm'
import BeanList from './BeanList'



export default function Home() {

  const [query, setQuery] = useState('')
  const { user } = useAuthContext()

    const { documents, error } = useCollection(
      "beans",
      ["userId", "==", user.uid],
      ["createdAt", "desc"]
    )

  const handleSearch = (e) => {
    e.preventDefault()
    console.log(query)
    
  }


  return (
    <>
    <form onSubmit={handleSearch} className={styles.search}>
        <input 
        type="search" 
        onChange={(e) => setQuery(e.target.value)}
        value={ query }
        placeholder="Search"
        required/>
    </form>
    <div className={styles.container}>
      
      {<AddBeanForm  uid={user.uid}/>}
    
      <div className={styles.content}>
          {error && <p>{error}</p>}
          {documents && <BeanList beans={documents} query={query}/>}
      </div>
      

    
    </div>
    </>
  )
}
