import { PublicShopContext } from "../context/publicShopContext";
import { useContext } from "react";

export const usePublicShopContext = ()=>{
   const context = useContext(PublicShopContext)

   if(!context){
    throw Error('usePublicShopContext must be used inside a PublicShopContextProvider ')
   }

   return context
}