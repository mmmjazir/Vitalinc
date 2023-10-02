import { PublicMedicineContext } from "../context/publicMedicineContext";
import { useContext } from "react";

export const usePublicMedicineContext = ()=>{
   const context = useContext(PublicMedicineContext)

   if(!context){
    throw Error('usePublicMedicineContext must be used inside a PublicMedicineContextProvider ')
   }

   return context
}