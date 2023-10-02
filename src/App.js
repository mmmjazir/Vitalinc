import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {useAuthContext} from './hooks/useAuthContext'

//pages and components
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar'
import Signup from './pages/Signup';
import Login from './pages/Login'
import Medicine from './pages/medicines/Medicine';
import Medicines from './pages/medicines/Medicines'
// profile routes
import ShopSubmitForm from './pages/profile/shopSubmitForm/ShopSubmitForm';
import ShopDetails from './pages/profile/shopDetails/ShopDetails';
import ShopEdit from './pages/profile/shopDetails/ShopEdit';
import MedicineSubmitForm from './pages/profile/medicineSubmitForm/MedicineSubmitForm'
import MedicineDetails from './pages/profile/medicineDetails/MedicineDetails';
import MedicineEdit from './pages/profile/medicineDetails/MedicineEdit';

function App() {
  const {user} = useAuthContext()

  return (
    <div className="App">
     <BrowserRouter>
       <Navbar />
       <div className="pages">
          <Routes>
          
             <Route path='/' element={<Home/>} />

             <Route path='/medicines' element={ <Medicines/> } />

             <Route path="/medicines/:id" element={<Medicine/>} />

             <Route path='/profile/createshop' element={ <ShopSubmitForm/> } />
             <Route path='/profile/shopdetails' element={ <ShopDetails/> } />
             <Route path='/profile/shopEdit/:id' element={ <ShopEdit/> } />

             <Route path='/profile/createMedicine/:id' element={ <MedicineSubmitForm/> } />
             <Route path='/profile/medicinedetails' element={ <MedicineDetails/> } />
             <Route path='/profile/medicineEdit/:id' element={ <MedicineEdit/> } />

            <Route path='/signup' element={!user ? <Signup/> : <Navigate to='/medicines' /> } />
         
         
            <Route path='/login' element={!user ? <Login/> : <Navigate  to='/medicines' /> } />
          </Routes>

       </div>
     </BrowserRouter>
    </div>
  );
}

export default App;
