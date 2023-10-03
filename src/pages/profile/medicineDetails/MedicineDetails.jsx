import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";

import { useMedicineContext } from '../../../hooks/useMedicineContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import Profile from '../../../components/Profile/Profile'
import Loading from '../../../components/loading/Loading';
import {
  Box,
  Text,
  IconButton,
  Image,
  HStack,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const MedicineDetails = () => {
    const {user, userRole} = useAuthContext()
    const {medicines, dispatch} = useMedicineContext()
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true)

    const showSuccessMessage = (message) => {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage("");
        window.location.reload();
      }, 1400);
    };
  
    const showErrorMessage = (message) => {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage("");
      }, 1400);
    };
  

    useEffect(() => {
    
      const fetchMedicineForEdit = async ()=>{
       if (user && userRole === 'seller' ) {
          const response = await fetch(`https://appbackend-lake.vercel.app/api/medicines`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
  
        const json = await response.json()

        if(!response.ok){
         setIsLoading(false)
         console.error(json.error)
        }
        if(response.ok){
          setIsLoading(false)
         dispatch({type:'SET_MEDICINES',payload:json})
        }
      }
        }
       if(user && userRole === 'seller'){
          fetchMedicineForEdit()
        }
    }, [dispatch,user,userRole,medicines])


    const handleDelete = async (_id)=>{
       
        if(!user){
            return
        }
        if(userRole !=='seller'){
            return
        }

        const response = await fetch('https://appbackend-lake.vercel.app/api/medicines/' +_id, {
            method: 'DELETE',
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
      
        if(!response.ok){
          showErrorMessage('delete failed, refresh the page and try again')
       }

      if(response.ok){
          dispatch({type:'DELETE_MEDICINE', payload:json})
          showSuccessMessage('Medicine Deleted Successfully')
      }

    }
    return ( 
         
       <div className='Profile'>
        <Profile/>
        {isLoading ? <Loading/> : 
        <div className='MainContent'>

         {medicines && medicines.length > 0 ? (
          medicines.map((medicine)=>(
           <div className="medicine-details" key={medicine._id} >
         
         <Box
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                mb={4}
                shadow="md"
              >
                <HStack spacing={4}>
                  <Box>
                    <Image
                      src="https://via.placeholder.com/150"
                      alt="Medicine Image"
                      fallbackSrc="https://via.placeholder.com/150"
                      borderRadius="md"
                    />
                  </Box>
                  <VStack spacing={1} align="start" flex="1">
                    <Text>
                      <strong>Medicine name:</strong> {medicine.medicinename}
                    </Text>
                    <Text>
                      <strong>Additional details:</strong> {medicine.medicinedetails}
                    </Text>
                    <Text
                      color={medicine.available ? "green.600" : "red.600"}
                      fontWeight="bold"
                    >
                      {medicine.available ? "Available" : "Unavailable"}
                    </Text>
                    <Text>
                      <strong>Price:</strong> {medicine.price}₹
                    </Text>
                  </VStack>
                  <Spacer />
                  <HStack spacing={1}>
                    <Link to={`/profile/medicineEdit/${medicine._id}`}>
                      <IconButton
                        colorScheme="teal"
                        aria-label="Edit Medicine"
                        icon={<EditIcon />}
                      >
                        Edit
                      </IconButton>
                    </Link>
                    <IconButton
                      colorScheme="red"
                      aria-label="Delete Medicine"
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(medicine._id)}
                    >
                      Delete
                    </IconButton>
                  </HStack>
                </HStack>
              </Box>
         
          </div>
           ))
         ) : ( <p>No Medicines Created in Your Shop.</p> )}
         {errorMessage && <div className="error">{errorMessage}</div> }
          {successMessage && <div className="success">{successMessage}</div> }
        
         </div> }
         </div>
      
      
     );
}
 
export default MedicineDetails;
