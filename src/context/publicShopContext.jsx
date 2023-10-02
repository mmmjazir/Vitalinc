import { createContext, useReducer } from "react";

export const PublicShopContext = createContext()

export const publicShopReducer = (state,action) =>{
    switch(action.type){
         case 'SET_PUBLIC_SHOPS': 
           return {
              publicshops: action.payload
           }
           case 'SET_PUBLIC_SHOP': 
           return {
              publicshops: action.payload
           }
        
        default:
            return state
    }
}

export const PublicShopContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(publicShopReducer, {
        publicshops: []
    })

    return ( 
        <PublicShopContext.Provider value={{...state,dispatch}}>
          {children}
        </PublicShopContext.Provider>
     );
}
 