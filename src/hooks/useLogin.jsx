import {useState} from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () =>{

    const [error, setError] = useState(null)
    const [isloading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

   const login = async (email, password)=>{
       setIsLoading(true)
       setError(null)

       const response = await fetch('https://vitalincbackend.vercel.app/api/user/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({email,password})
       })

       const json = await response.json()

    if(!response.ok){
        setIsLoading(false)
        setError(json.error)
    }
    if(response.ok){
      // save the user to local storage
     
      localStorage.setItem('user', JSON.stringify({ email: json.email,token: json.token , role: json.role  }));

      // update AuthContext
      dispatch({ type: 'LOGIN', payload: { email: json.email,token: json.token, role: json.role  } });

     setIsLoading(false)
     setError(null)
    }

   }

   return {login, isloading, error}
     
}
