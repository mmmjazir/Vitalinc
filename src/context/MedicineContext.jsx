import { createContext, useReducer } from "react";

export const MedicineContext = createContext()

export const medicineReducer = (state,action) =>{
    switch(action.type){
        case 'SET_MEDICINES': 
           return {
              medicines: action.payload
           } 
           case 'SET_MEDICINE':
            return {
              medicines: action.payload
            };
  
           case 'CREATE_MEDICINE':
            return{
                medicines: [action.payload,...state.medicines]
            }
            case 'DELETE_MEDICINE':
                return {
                    medicines: state.medicines.filter((m)=> m._id !== action.payload._id)
                }
                case 'UPDATE_MEDICINE':
                    const updatedMedicineIndex = state.medicines.findIndex((medicine) => medicine._id === action.payload._id);
                    if (updatedMedicineIndex !== -1) {
                      const updatedMedicines = [...state.medicines];
                      updatedMedicines[updatedMedicineIndex] = action.payload;
                      return {
                        medicines: updatedMedicines
                      };
                    } else {
                        return state;
                      }
        
             default:
                return state
    }
}

export const MedicineContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(medicineReducer, {
        medicines: []
    })

    return ( 
        <MedicineContext.Provider value={{...state,dispatch}}>
          {children}
        </MedicineContext.Provider>
     );
}
 