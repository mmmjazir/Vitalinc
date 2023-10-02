import { createContext, useReducer } from "react";

export const ShopContext = createContext()

export const shopReducer = (state,action) =>{
    switch(action.type){
        case 'SET_SHOPS': 
           return {
              shops: action.payload
           }
           case 'SET_SHOP': 
           return {
              shops: action.payload
           }
           case 'CREATE_SHOP':
            return{
                shops: [action.payload,...state.shops]
            }
            case 'DELETE_SHOP':
                return {
                    shops: state.shops.filter((s)=> s._id !== action.payload._id)
                }
            case 'UPDATE_SHOP':
                const updatedShopIndex = state.shops.findIndex((shop) => shop._id === action.payload._id);
                if (updatedShopIndex !== -1) {
                  const updatedShops = [...state.shops];
                  updatedShops[updatedShopIndex] = action.payload;
                  return {
                    shops: updatedShops
                  };
                } else {
                  return state;
                }
        
        default:
            return state
    }
}

export const ShopContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(shopReducer, {
        shops: []
    })

    return ( 
        <ShopContext.Provider value={{...state,dispatch}}>
          {children}
        </ShopContext.Provider>
     );
}
 