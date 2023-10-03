import {useState} from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = ()=>{
    const [error, setError] = useState(null)
    const [isloading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

   const signup = async (role,email,password)=>{
       setIsLoading(true)
       setError(null)

       const response = await fetch('https://appbackend-lake.vercel.app/api/user/signup',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({role,email,password})
       })

       const json = await response.json()

    if(!response.ok){
        setIsLoading(false)
        setError(json.error)
    }
    if(response.ok){
      // save the user to local storage

      localStorage.setItem('user', JSON.stringify({ id: json._id, email: json.email,token: json.token , role: json.role  }));
      
      // update AuthContext
      dispatch({ type: 'LOGIN', payload: { id: json._id, email: json.email,token: json.token, role: json.role  } });

     setIsLoading(false)
     setError(null)
    }

   }

   return {signup, isloading, error}

}
