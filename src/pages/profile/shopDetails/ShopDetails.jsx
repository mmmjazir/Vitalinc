import { useState, useEffect } from 'react'
import { Link,NavLink } from "react-router-dom";
import { useShopContext } from '../../../hooks/useShopContext'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { useMedicineContext } from '../../../hooks/useMedicineContext'
import Profile from '../../../components/Profile/Profile'
import Loading from '../../../components/loading/Loading';

import { Card, CardHeader,IconButton,HStack, CardBody, CardFooter, Stack,Link as ChakraLink, Heading, Text, Button, Box,
  
} from '@chakra-ui/react'
import { AddIcon,InfoIcon,DeleteIcon,EditIcon, ExternalLinkIcon} from '@chakra-ui/icons'

const ShopDetails = () => {
    const {user, userRole} = useAuthContext()
    const {shops, dispatch} = useShopContext()
    const { dispatch: medicineDispatch } = useMedicineContext()

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
        window.location.reload()
      }, 1400);
    };

    useEffect(() => {
      const fetchShops = async ()=>{
        const response = await fetch(`http://localhost:4000/api/shops`, {
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
            dispatch({type:'SET_SHOPS',payload:json})
            setIsLoading(false)
        }
         
      }

      if(user && userRole === 'seller' ){
        fetchShops()
      }
    }, [dispatch,user,userRole,shops])


    

    const handleDelete = async (_id)=>{
       
        if(!user){
            return
        }
        if(userRole !=='seller'){
            return
        }


        const response = await fetch('http://localhost:4000/api/shops/' +_id, {
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
          dispatch({type:'DELETE_SHOP', payload:json.shop})
          medicineDispatch({ type: 'DELETE_MEDICINE', payload: json.medicine });
          showSuccessMessage('Shop Deleted Successfully')
      }

    }

    const openGoogleMaps = ({lat, long}) => {
    
          window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${long}`, '_blank');
      }
    return ( 
         <div className='Profile'>
         <Profile/>
         {!isLoading ? (
        <div className='MainContent'>
          {shops && shops.length > 0 ? (
            shops.map((shop) => (
              <div key={shop._id}>
                <Card
                  direction={{ base: 'column', sm: 'row' }}
                  overflow='hidden'
                  h='35vh'
                  p='2rem'
                  m='1rem'
                  boxShadow='md'
                >
                  <Box flex='1'>
                    <Heading color='purple.400' size='xl' mb='1rem'>
                      {shop.shopname}
                    </Heading>
                    <Text fontWeight='bold' mb='1rem'>
                     <InfoIcon/>{''} Address: {shop.address}
                    </Text>
                    <Text fontWeight='bold' mb='1rem'>
                    <InfoIcon/>{''} City: {shop.city}
                    </Text>
                    <Button colorScheme='purple' variant='link'>
                      
                      <ChakraLink onClick={() => openGoogleMaps({ lat: shop.latitude, long: shop.longitude })}>
                       <ExternalLinkIcon />{' '} Shop Location
                      </ChakraLink>
                    </Button>
                  </Box>

                  <CardFooter d='flex' alignItems='center'>
                    
                    <HStack spacing={1}>
                    <Link to={`/profile/shopEdit/${shop._id}`}>
                      <IconButton
                        colorScheme="teal"
                        aria-label="Edit Medicine"
                        icon={<EditIcon />}
                      >
                        Edit
                      </IconButton>
                    </Link>
                   
                  
                    <Link to={`/profile/createMedicine/${shop._id}`}>
                      <Button variant='solid' colorScheme='purple' ml='1rem'>
                        <AddIcon /> Medicine
                      </Button>
                    </Link>
                   
                    <IconButton
                      colorScheme="red"
                      aria-label="Delete Shop"
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(shop._id)}
                    >
                      Delete
                    </IconButton>
                    </HStack>
                  </CardFooter>
                </Card>
              </div>
            ))
          ) : (
            <p>No Shops Created in Your Account.</p>
          )}
          {errorMessage && <div className='error'>{errorMessage}</div>}
          {successMessage && <div className='success'>{successMessage}</div>}
        </div>
      ) : (
        <Loading />
      )}
        
        </div>



     );
     
}
 
export default ShopDetails;