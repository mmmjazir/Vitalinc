import { createContext, useReducer } from "react";

export const PublicMedicineContext = createContext()


export const publicMedicineReducer = (state,action) =>{
    switch(action.type){
         
        case 'SET_PUBLIC_MEDICINES':
              return {
                publicmedicines: action.payload
              };
           case 'SET_PUBLIC_MEDICINE':
            return {
                publicmedicines: action.payload
            };
            case 'CREATE_PUBLIC_MEDICINE':
                return{
                    publicmedicines: [action.payload,...state.publicmedicines]
                }
                case 'DELETE_PUBLIC_MEDICINE':
                    return {
                        publicmedicines: state.publicmedicines.filter((m)=> m._id !== action.payload._id)
                    }
                    case 'UPDATE_PUBLIC_MEDICINE':
                        const updatedMedicineIndex = state.publicmedicines.findIndex((medicine) => medicine._id === action.payload._id);
                        if (updatedMedicineIndex !== -1) {
                          const updatedMedicines = [...state.medicines];
                          updatedMedicines[updatedMedicineIndex] = action.payload;
                          return {
                            publicmedicines: updatedMedicines
                          };
                        } else {
                            return state;
                          }
        
             default:
                return state
    }
}

export const PublicMedicineContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(publicMedicineReducer, {
        publicmedicines: []
    })

    return ( 
        <PublicMedicineContext.Provider value={{...state,dispatch}}>
          {children}
        </PublicMedicineContext.Provider>
     );
}
 