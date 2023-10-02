import { useEffect,useState } from "react";

// internal import
import ShopSubmitForm from '../components/shopSubmitForm/ShopSubmitForm'
import ShopDetails from "../components/shopDetails/ShopDetails";
import MedicineDetails from "../components/medicineDetails/MedicineDetails";

import { useShopContext } from "../hooks/useShopContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useMedicineContext } from "../hooks/useMedicineContext";
import MedicineSubmitForm from "../components/medicineSubmitForm/MedicineSubmitForm";


const Profile = () => {

  const {user, userRole} = useAuthContext()
  const {shops,dispatch} = useShopContext()
  const {medicines,dispatch: medicineDispatch} = useMedicineContext()
 
  const [showForm, setShowForm] = useState(""); 
  const [selectedShopId, setSelectedShopId] = useState('');
  const [medShopIds,setMedShopIds] = useState([])
  const [isLoading, setIsLoading] =useState(false)
  const[loading,setLoading] = useState(null)

  useEffect(() => {
    const fetchShops = async ()=>{
      const response = await fetch('https://vitalincbackend.vercel.app/api/shops', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()
      
      if(response.ok){
          dispatch({type:'SET_SHOPS',payload:json})
      }
       
    }
    if(user && userRole === 'seller' ){
      fetchShops()
    }
  }, [dispatch,user,userRole,shops])
  
  const handleShopDetailsClick = () => {

    


    if(shops){
      const shopIds = shops.map((shop) => shop._id);
    setMedShopIds(shopIds)
    }
    setShowForm("medicinedetails");
  };

  useEffect(() => {
    
    const fetchMedicines = async ()=>{
      if(medShopIds && medShopIds.length > 0){
      for (const shopId of medShopIds) {
        const response = await fetch(`https://vitalincbackend.vercel.app/api/medicines?shop_id=${shopId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })

      
      const json = await response.json()
      
      if(response.ok){
          medicineDispatch({type:'SET_MEDICINES',payload:json})
      }
    }}
      }
     if(user && userRole === 'seller'){
        fetchMedicines()
      }
  }, [medicineDispatch,user,userRole,medShopIds,shops,medicines])
  

  return (
    
    <div className='Profile'>
    <div className='Sidebar'>
      <div
        className='SidebarOption'
        onClick={() => setShowForm("shopform")}
      >
        Provide Your Shop Details
      </div>
      <div
        className='SidebarOption'
        onClick={() => setShowForm("shopdetails")}
      >
        Your Shop Details
      </div>
      <div
        className='SidebarOption'
        onClick={ handleShopDetailsClick}
      >
        Your Medicine Details
      </div>
    </div>

    <div className='MainContent'>
      {showForm === "shopform" && shops &&
      
     ( !shops.length > 0 ? (<ShopSubmitForm setIsLoading={setIsLoading} /> ) 
      : (isLoading == false ? <div>Shop Added check 'Your Shop Details' To See The Details</div> : ( <div className="success">Adding Your Shop...</div> )) 
      )
      }
      {showForm === "medicine" && ( 
        <>
        <button onClick={()=> setShowForm('shopdetails')}>return</button>
      <MedicineSubmitForm shop_id={selectedShopId} />
       </>
      ) }
      {showForm === "shopdetails" &&
          (shops && shops.length > 0 ? (
            shops.map((shop) => (
              <ShopDetails key={shop._id} shop={shop} setSelectedShopId={setSelectedShopId} setShowForm={setShowForm} />
            ))
          ) : (
            <p>No Shops Created in Your Account.</p>
           
          ))}

     {showForm === "medicinedetails" &&
     (medicines && medicines.length > 0 ? (
          medicines.map((medicine) => (
          medicine.shop_id == shops._id ? (
          <MedicineDetails  key={medicine._id}  medicine={medicine} setLoading={setLoading} loading={loading} />  
           ):(
            <p>You Don't Create medicines In Your Account.</p>
          )
          )
          )
        ) : (
          <>
          <p>You Don't Create medicines In Your Account.</p>
          </>
        ))}


    </div>
  </div>
);
};

export default Profile;
