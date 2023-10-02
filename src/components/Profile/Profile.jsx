import { NavLink } from "react-router-dom";
import { List, ListItem, ListIcon } from "@chakra-ui/react"
import { AddIcon,InfoIcon } from '@chakra-ui/icons'

const Profile = () => {
    
    return ( 
       
      
     <List color="white" bg='purple.400' p='10px'  fontSize="1.2em" spacing={4}>
      <ListItem  p='10px' >
        <NavLink to="/profile/createshop">
          <ListIcon as={AddIcon} color="white" />
          Shop 
        </NavLink>
      </ListItem>
      <ListItem  p='10px'>
        <NavLink to="/profile/shopdetails">
          <ListIcon as={InfoIcon} color="white" />
          Shop Details
        </NavLink>
      </ListItem>
      <ListItem  p='10px' >
        <NavLink to="/profile/medicinedetails">
          <ListIcon as={InfoIcon} color="white" />
          Medicine Details
        </NavLink>
      </ListItem>
    </List>

    
     );
}
 
export default Profile;