import styles from './Navbar.module.css'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

import React from 'react'

export default function Navbar() {

  const { logout } = useLogout()
  const { user } = useAuthContext()

  return (
    <nav className={styles.navbar}>
        <ul>
            <li className={styles.title}>
                Bean Tracker
            </li>
            {/** conditionally show login/signup buttons depending on user logged in or not */}
            {!user && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li> 
              </>
            )}
            {user && (
              <>
              <li>Hello, {user.displayName}</li>
            <li>
              <button className={styles.btn} onClick={logout}>Logout</button>
            </li>
            </>
            )}

        </ul>
    </nav>
  )
}
