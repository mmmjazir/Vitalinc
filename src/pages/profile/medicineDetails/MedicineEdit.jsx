import {useParams, Link } from "react-router-dom";
import { useState, useEffect } from 'react';

import { useMedicineContext } from '../../../hooks/useMedicineContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import Profile from '../../../components/Profile/Profile'
import Loading from "../../../components/loading/Loading";
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

const MedicineEdit = () => {
    const {user, userRole} = useAuthContext()
    const {dispatch} = useMedicineContext()
    const [inputs, setInputs] = useState();
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null);
    const [emptyFields, setEmptyFields] = useState([])
    const[isLoading, setIsLoading] = useState(true)

    const { id } = useParams();


    const showSuccessMessage = (message) => {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage("");
        window.location.reload();
      }, 1400);
    };
  

    useEffect(() => {
    
        const fetchMedicineForEdit = async ()=>{
         if (user && userRole === 'seller' ) {
            const response = await fetch(`https://appbackend-lake.vercel.app/api/medicines/${id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
    
          const json = await response.json()
          if(!response.ok){
            console.error(json.error)
            setIsLoading(false)
           }
          if(response.ok){
           dispatch({type:'SET_MEDICINE',payload:json})
           setInputs(json)
           setIsLoading(false)
          }
        }
          }
         if(user && userRole === 'seller'){
            fetchMedicineForEdit()
          }
      }, [dispatch,user,userRole,id])



    const handleChange = (e) => {
      setInputs((prevState) => ({
        ...prevState,
        [e.target.name] : e.target.value
      }));
      };
    
      const handleSaveEdit = async () => {
        if (!user) {
          return;
        }
        if (userRole !== 'seller') {
          return;
        }
    
        const response = await fetch(`https://appbackend-lake.vercel.app/api/medicines/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(inputs)
        });
      
        const json = await response.json();
       
        if (!response.ok) {
          setErrorMessage(json.error)
          setEmptyFields(json.emptyFields || [] )
        }

        if (response.ok) {
          setErrorMessage(null)
          showSuccessMessage('Shop updated successfully')
        }
      };

    return ( 
         
        <div className="Profile" >
            <Profile/>
          {inputs && 
          <div className='MainContent'>
            {isLoading ? <Loading/> :
            <>
       <Link to='/profile/medicinedetails'>  <Button colorScheme="purple" > Return </Button> </Link>
       <Heading>Edit Medicine</Heading>
       <FormControl id="shopName" isRequired>
        <FormLabel>Medicine Name:</FormLabel>
            <Input
              type="text"
              value={inputs.medicinename}
              name="medicinename"
              onChange={handleChange}
              className={emptyFields.includes('medicinename') ? 'error' : ''}
            />
            </FormControl>
            <FormControl id="shopName" isRequired>
             <FormLabel>Additional details:</FormLabel>
            <Input
              type="text"
              name="medicinedetails"
              value={inputs.medicinedetails}
              onChange={handleChange}
              className={emptyFields.includes('medicinedetails') ? 'error' : ''}
            />
            </FormControl>
             <FormLabel>Medicine Availability:</FormLabel>
              <Select name="available" value={inputs.available} onChange={handleChange}  >
                <option value={true}>Available</option>
                <option value={false}>UnAvailable</option>
             </Select>
             <FormControl id="shopName" isRequired>
             <FormLabel>Medicine Price in(₹):</FormLabel>
            <Input
              type="Number"
              name="price"
              value={inputs.price}
              onChange={handleChange}
              className={emptyFields.includes('price') ? 'error' : ''}
            />
            </FormControl>
             <Button colorScheme="purple" onClick={handleSaveEdit}>Save Changes</Button>
             {successMessage && <div className="success">{successMessage}</div>}
             {errorMessage && <div className="error">{errorMessage}</div>}
         </>}
         </div> 
      }
       </div>

     );
}
 
export default MedicineEdit;
