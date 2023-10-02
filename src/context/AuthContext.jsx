import { createContext, useEffect, useReducer, useState} from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN' : 
        return {user: action.payload}
        case 'LOGOUT':
            return {user: null}
        default: return state
    }
}

export const AuthContextProvider = ({children}) =>{
  const[ userRole, setUserRole] = useState(null)

   const [state, dispatch] = useReducer(authReducer,{
    user : null
   })

   useEffect(()=>{
      const user = JSON.parse(localStorage.getItem('user'))
    
      if(user){
        dispatch({type:'LOGIN',payload:user})
      }
      
   },[])

   useEffect(()=>{
    async function fetchUserRole(){

    const storedUser = localStorage.getItem('user');
     const User = await JSON.parse(storedUser);
     if ( User && User.role == "seller") {
         setUserRole('seller')
       }
    }
   fetchUserRole()
     
  },[state.user])
    
   return (
     <AuthContext.Provider value={{...state,dispatch, userRole}}>
        {children}
     </AuthContext.Provider>
   )
}