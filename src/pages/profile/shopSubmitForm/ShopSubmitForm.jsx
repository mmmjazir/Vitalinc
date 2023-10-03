import { useState, useEffect } from "react";
import { useShopContext } from "../../../hooks/useShopContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useCitySorting } from "../../../hooks/useCitySorting/useCitySorting";
import Profile from '../../../components/Profile/Profile'
import Loading from '../../../components/loading/Loading'
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Stack,
  List,
  ListItem,
} from "@chakra-ui/react";


const ShopSubmitForm = () => {
  const {shops, dispatch } = useShopContext();
  const { user, userRole } = useAuthContext();
 const { cities, suggestionsRef, city, suggestions, showSuggestions, setCity, handleInputChange, handleCitySelect, handleInputClick, handleInputBlur } = useCitySorting()

  const [shopname, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 1400);
  };
 

  useEffect(() => {
    const fetchShops = async ()=>{
      const response = await fetch(`https://appbackend-lake.vercel.app/api/shops`, {
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
          dispatch({type:'SET_SHOPS',payload:json})
          setIsLoading(false)
        }
      }
    if(user && userRole === 'seller' ){
      fetchShops()
    }
  }, [dispatch,user,userRole,shops ])
  

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setErrorMessage("Failed to get current location.");
        }
      );
    } else {
      console.error("Geolocation not supported.");
      setErrorMessage("Geolocation is not supported by your browser.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage("You must be logged in");
      return;
    }
    if (userRole !== "seller") {
      setErrorMessage("You must have to be a seller to do this action");
      return;
    }

    if (latitude === null || longitude === null) {
      setErrorMessage("Please use the current location ");
      return;
    }

    if (!cities.includes(city)) {
      setErrorMessage("Please select a valid city from the suggestions.");
      return;
    }

    const shop = { shopname, address, city, latitude, longitude };

    const response = await fetch("https://appbackend-lake.vercel.app/api/shops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(shop),
    });
    const json = await response.json();

    if (!response.ok) {
      setErrorMessage(json.error);
      setEmptyFields(json.emptyFields || []);
    }
    if (response.ok) {
      setShopName("");
      setAddress("");
      setCity("");
      setEmptyFields([]);
      setErrorMessage(null);
      setLatitude(null);
      setLongitude(null);
      showSuccessMessage("Shop Added successfully");
      // dispatch({ type: "CREATE_SHOP", payload: json });
    }
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
      {shops && shops.length > 0 ? (
        <div>Shop Added check 'Your Shop Details' To See The Details</div>
      ) : (
        isLoading ? <Loading/> :
        <form onSubmit={handleSubmit}>
          <Heading>Add a New Shop</Heading>
          <FormControl id="shopName" isRequired>
            <FormLabel>Shop Name:</FormLabel>
            <Input
              type="text"
              value={shopname}
              onChange={(e) => setShopName(e.target.value)}
              className={emptyFields.includes("shopname") ? "error" : ""}
            />
          </FormControl>

          <FormControl id="shopAddress" isRequired>
            <FormLabel>Shop Address:</FormLabel>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={emptyFields.includes("address") ? "error" : ""}
            />
          </FormControl>

          <FormControl id="locatedCity" isRequired>
            <FormLabel>Located city:</FormLabel>
            <Input
              type="text"
              placeholder="Search cities..."
              value={city}
              onChange={(e) => handleInputChange(e.target.value)}
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              className={emptyFields.includes("city") ? "error" : ""}
            />
            {showSuggestions && (
              <List className="suggestion-list" ref={suggestionsRef} zIndex="popover"
              bg="white"
              position="absolute"  >
                {suggestions.map((suggestion) => (
                  <ListItem
                    key={suggestion}
                    className="suggestion"
                    onClick={() => handleCitySelect(suggestion)}
                  >
                    {suggestion}
                  </ListItem>
                ))}
              </List>
            )}
          </FormControl>

          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            colorScheme="purple"
            variant="outline"
          >
            Use Current Location
          </Button>

          <FormControl id="latitudeLongitude" isRequired>
            <FormLabel>Latitude & Longitude:</FormLabel>
            <Input
              type="text"
              disabled
              value={latitude && longitude ? `${latitude}, ${longitude}` : ""}
            />
          </FormControl>

          <Button type="submit" colorScheme="purple">
            Add Shop
          </Button>
          {successMessage && (
            <Text className="success" color="green">
              {successMessage}
            </Text>
          )}
          {errorMessage && (
            <Text className="error" color="red">
              {errorMessage}
            </Text>
          )}
        </form>
      )}
    </Box>
  </Flex>
  );
};

export default ShopSubmitForm;
