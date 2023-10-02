import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { useMedicineContext } from "../../../hooks/useMedicineContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Profile from '../../../components/Profile/Profile'
import { usePublicMedicineContext } from '../../../hooks/usePublicMedicineContext'
import {
   Box,
   Button,
   Flex,
   Heading,
   FormControl,
   FormLabel,
   Input,
   Select,
   Text,
   Stack,
   List,
   ListItem,
 } from "@chakra-ui/react";

const MedicineSubmitForm = () => {
    const {dispatch} = useMedicineContext()
   const {user,userRole} = useAuthContext()
   const { dispatch:publicMedicineDispatch} = usePublicMedicineContext()
   const { id } = useParams();

   const[medicinename, setMedicineName] = useState('')
   const[medicinedetails, setMedicineDetails] = useState('')
   const[available, setAvailable] = useState(false)
   const[price,setPrice] = useState(0)
   const[errorMessage, setErrorMessage] = useState(null)
   const [successMessage, setSuccessMessage] = useState(null)
   const [emptyFields, setEmptyFields] = useState([])

   const showSuccessMessage = (message) => {
      setSuccessMessage(message);
  
      setTimeout(() => {
        setSuccessMessage('');
        window.location.reload();
      }, 1500);
    };
  
    const showErrorMessage = (message) => {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage("");
      }, 1800);
    };


   const handleSubmit = async (e)=>{
      e.preventDefault()
       if(!user ){
         setErrorMessage('You must be logged in')
         return
       }
       if(userRole !== 'seller'){
         setErrorMessage('You must have to be a seller to do this action')
       }
  
       const medicine = {medicinename,medicinedetails,available,price,shop_id:id}

       const response = await fetch('http://localhost:4000/api/medicines',{
         method:'POST',
         headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
         },
         body: JSON.stringify(medicine)
     })
     const json = await response.json()

     if(!response.ok){
        showErrorMessage(json.error) 
        setEmptyFields(json.emptyFields || [] )
     }
     if(response.ok){
      setMedicineName('')
      setMedicineDetails('')
      setPrice(0)
      setEmptyFields([])
      setErrorMessage(null)
      showSuccessMessage('Medicine Added Successfully')
      dispatch({type:'CREATE_MEDICINE',payload:json})
      publicMedicineDispatch({type:'CREATE_PUBLIC_MEDICINE',payload:json})
     }
      }
     
      const handleChange = (e) => {
         setAvailable(e.target.value);
       };

    return ( 
      <Flex direction="row">
    <div
      className="Profile"
      minW="200px"
      minH="100vh"
      backgroundColor="#673ab7"
      padding="20px"
    >
      <Profile />
    </div>
    <Box
      className="MainContent"
      flex="1"
      padding="20px"
      backgroundColor="#fff"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1"
    >
     <Link to='/profile/shopdetails'> <Button colorScheme="purple" > Return </Button></Link>
        <form  onSubmit={handleSubmit} >
            <Heading>Add a New Medicine for Your Shop</Heading>

            <FormControl>
            <FormLabel>Medicine Name:</FormLabel>
            <Input
              type="text"
              value={medicinename}
              onChange={(e) => setMedicineName(e.target.value)}
              className={emptyFields.includes('medicinename') ? 'error' : ''}
            />
          </FormControl>
           <FormControl>
            <FormLabel>Additional Details:</FormLabel>
            <Input
              type="text"
              value={medicinedetails}
              onChange={(e) => setMedicineDetails(e.target.value)}
              className={emptyFields.includes('medicinedetails') ? 'error' : ''}
            />
          </FormControl>
             <FormControl>
            <FormLabel>Medicine Availability:</FormLabel>
            <Select
              value={available}
              onChange={handleChange}
              className={emptyFields.includes('available') ? 'error' : ''}
            >
              <option value="true">Available</option>
              <option value="false">UnAvailable</option>
            </Select>
            </FormControl>
            <FormControl>
            <FormLabel>Medicine Price in (₹):</FormLabel>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={emptyFields.includes('price') ? 'error' : ''}
            />
          </FormControl>
            
          <Button
            type="submit"
            colorScheme="purple"
          >
            Add Medicine
          </Button>
            {successMessage && <div className="success">{successMessage}</div> }
            {errorMessage && <div className="error">{errorMessage}</div> }
         </form>
        
         </Box>
        </Flex>
     );
}
 
export default MedicineSubmitForm;