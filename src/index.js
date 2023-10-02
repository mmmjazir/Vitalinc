import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ShopContextProvider } from './context/ShopContext';
import { MedicineContextProvider } from './context/MedicineContext';
import {PublicShopContextProvider} from './context/publicShopContext'
import {PublicMedicineContextProvider} from './context/publicMedicineContext'
import { ChakraProvider } from '@chakra-ui/react'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <AuthContextProvider>
   < ShopContextProvider>
   <MedicineContextProvider>
    <PublicShopContextProvider>
   <PublicMedicineContextProvider>
   <ChakraProvider>
    <App />
    </ChakraProvider>
  </PublicMedicineContextProvider>
  </PublicShopContextProvider>
  </MedicineContextProvider>
 </ShopContextProvider>
 </AuthContextProvider>

  </React.StrictMode>
);
