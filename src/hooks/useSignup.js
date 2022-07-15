import { useState, useEffect } from "react"
import { projectAuth } from "../firebase/config"
import { useAuthContext } from "./useAuthContext"


export const useSignup = () => {

    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName) => {
        setError(null)
        setIsPending(true)

        try {
            //Sign up user using firebase auth
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)
            

            if (!res) {
                throw new Error('could not complete signup')
            }

            // Add display name to user
            await res.user.updateProfile({ displayName: displayName })

            // dispatch login action
            dispatch({type: 'LOGIN', payload: res.user})
             //update state
             if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        }
        catch (err) {
            
             //update state
             if (!isCancelled) {
                console.log(err.message)
                setIsPending(false)
                setError(null)
            }
        }
    }
    useEffect(() => {
        // cleanup function to ensure state is not updated once the component is unmounted
        return () => setIsCancelled(true)
      
    }, [])
    

    return { error, isPending, signup }

}