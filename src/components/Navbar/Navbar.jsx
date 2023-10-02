import { Link } from "react-router-dom";
import { Box, Flex, Heading, Text, Button, Spacer, HStack, Avatar, Icon } from '@chakra-ui/react'

import {useLogout} from '../../hooks/useLogout'
import { useAuthContext } from "../../hooks/useAuthContext"

const Navbar = () =>{

    const {logout} = useLogout()
    const {user,userRole} = useAuthContext()

    const handleClick =()=>{
        logout();
        window.location.reload()
    }


    return(
        <Flex as="nav" p="20px" alignItems="center" gap="10px" bg="gray.200" >
         
         <Heading color='purple.400' ml="4em" as="h1" _hover={{ color: "black" }} cursor="pointer" > Vitalinc </Heading>

        <Spacer/>

     <HStack spacing="20px"  >
         <Box color='purple.400' fontSize='lg' fontWeight='semibold' _hover={{ borderBottom: '3px solid purple' }} >
         <Link to='/' >Home</Link>
         </Box>
         
         <Box color='purple.400' fontSize='lg' fontWeight='semibold' _hover={{ borderBottom: '3px solid purple' }}>
         <Link to='/medicines'  >Medicines</Link>
         </Box>

         {user && userRole == 'seller' && (
                <Box color='purple.400' fontWeight='semibold' fontSize='lg' _hover={{ borderBottom: '3px solid purple' }} >
                   <Link to={`/profile/createshop`}  >Profile</Link>
                </Box>
                )
                }

                {user && (
                    <Box  display="flex" alignItems="center"  border="2px solid grey" p="5px" borderRadius="25px"  >
                        <Avatar size="sm" bg='purple.500' />
                        <Text color="grey" ml="2" fontWeight="bold" >{user.email}</Text>
                    </Box>
                )}
           {user && (
             <Box>
                <Button onClick={handleClick} colorScheme="purple" border="none" >Log out</Button>
                </Box>
           )
           }

             {!user && (
                <Box >
                    <Link to="/login">
                        <Button colorScheme="purple" border="none" >
                            Login 
                        </Button>
                       
                    </Link>
                </Box>
                )
                }     
                {!user && (
                <Box color='purple' fontWeight='semibold' fontSize='lg' _hover={{ borderBottom: '3px solid purple' }} >
                    <Link to="/signup">Signup</Link>
                </Box>
                )
                }     
           </HStack>

        </Flex>
    )
}

export default Navbar;