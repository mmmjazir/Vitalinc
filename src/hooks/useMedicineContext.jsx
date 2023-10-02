import { useContext } from "react";
import { MedicineContext } from "../context/MedicineContext"; 

export const useMedicineContext = () =>{
    const context = useContext(MedicineContext)

    if(!context){
        throw Error('useMedicineContext must be used inside MedicineContextProvider')
    }

   return context
}