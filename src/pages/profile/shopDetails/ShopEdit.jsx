import { useEffect, useState,useRef } from 'react';
import { useParams,Link } from 'react-router-dom';

import { useAuthContext } from '../../../hooks/useAuthContext';
import { useShopContext } from '../../../hooks/useShopContext';
import Profile from '../../../components/Profile/Profile'
import { useCitySorting } from '../../../hooks/useCitySorting/useCitySorting';
import Loading from '../../../components/loading/Loading';
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

import { CheckCircleIcon } from '@chakra-ui/icons'

const ShopEdit = () => {
  const { user, userRole } = useAuthContext();
  const { id } = useParams();
  const {dispatch: shopDispatch } = useShopContext();
  const { cities} = useCitySorting()

  const[gpsSelected, setGpsSelected] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null);
  const[isLoading, setIsLoading] = useState(true)

  const [emptyFields, setEmptyFields] = useState([]);
  // Get the shop data from the context
  
  const [inputs, setInputs] = useState();
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);


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
    }, 1500);
  };


  useEffect(() => {
    const fetchShopForEdit = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/shops/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

      if(!response.ok){
        console.error(json.error)
      }

        if (response.ok) {
          shopDispatch({ type: 'SET_SHOP', payload: json });
          // Update editedShop with the newly fetched data
          setInputs(json);
          setIsLoading(false)
        } 
      } catch (error) {
        console.error('Error fetching shop:', error);
      }
    };
    if (user && userRole === 'seller') {
      fetchShopForEdit();
    }
  }, [shopDispatch, user, userRole, id]);


  const handleCitySelect = (selectedCity) => {
    setInputs((prevState) => ({
      ...prevState,
      city:selectedCity
    }));
    
    setShowSuggestions(false);
  };

const handleInputClick = () => {
  setShowSuggestions(true);
};

const handleInputBlur = () => {
  setTimeout(() => {
    setShowSuggestions(false);
  }, 200);
};



  const handleInputChangeShop = (e) => {
   
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value
    }));
  };


  const handleUseCurrentLocation = () => {
    setGpsSelected(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInputs((prevState) => ({
            ...prevState,
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
          })); 
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

  
  const handleInputChange = (e) => {
    handleInputChangeShop(e);

  const filteredSuggestions = cities.filter((c) =>
    c.toLowerCase().includes(e.target.value.toLowerCase())
  );
  setSuggestions(filteredSuggestions);

  // Scroll to the top of the suggestions when the input changes
  if (suggestionsRef.current) {
    suggestionsRef.current.scrollTop = 0;
  }

  };

  const handleSave = async () => {
    if (!user) {
      setErrorMessage("You must be logged in");
      return;
    }
    if (userRole !== "seller") {
      setErrorMessage("You must have to be a seller to do this action");
      return;
    }
    if (!cities.includes(inputs.city)) {
      setErrorMessage("Please select a valid city from the suggestions.");
      return;
    }

    
      const response = await fetch(`http://localhost:4000/api/shops/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
          
        },
        body: JSON.stringify({
          shopname:inputs.shopname,
          address: inputs.address,
          city: inputs.city,
          latitude: inputs.latitude,
          longitude: inputs.longitude
         })
      });
      const json = await response.json();
      if (!response.ok) {
        showErrorMessage(json.error)
        setEmptyFields(json.emptyFields || []);
      }

      if (response.ok) {
        setEmptyFields([]);
        setErrorMessage(null)
        showSuccessMessage('Shop updated successfully')
      }
    
  };

  return (

    <div className='Profile'>
        <Profile/>
    {inputs &&
    <div className='MainContent'>
      {isLoading ? <Loading/> : 
      <>
      <Link to='/profile/shopdetails'>
     <Button colorScheme="purple" >
      Return
     </Button>
     </Link>
     <Heading>Edit Shop</Heading>
      
      <div>
        <FormLabel htmlFor="shopname">Shop Name:</FormLabel>
        <Input
        
          type="text"
          id="shopname"
          name="shopname"
          value={inputs.shopname}
          onChange={handleInputChangeShop}
          className={emptyFields.includes("shopname") ? "error" : ""}
        />
      </div>
      <div>
        <FormLabel htmlFor="address">Address:</FormLabel>
        <Input
          type="text"
          id="address"
          name="address"
          value={inputs.address}
          onChange={handleInputChangeShop}
          className={emptyFields.includes("address") ? "error" : ""}
        />
      </div>
      <div className="suggestion-container">
        <FormLabel >Located city :</FormLabel>
        <Input
          type="text"
          placeholder="Search cities..."
          name='city'
          value={inputs.city}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
          autoComplete="off"
          className={emptyFields.includes("city") ? "error" : ""}
        />
        {showSuggestions && (
          <div className="suggestion-list" ref={suggestionsRef} style={{ position: 'absolute', zIndex: 999 }} >
            {suggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="suggestion"
                onClick={() => handleCitySelect(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
      <Button  colorScheme='blue' type="button" onClick={handleUseCurrentLocation}>
        Use Current Location {gpsSelected ? <CheckCircleIcon/> : ''}
      </Button>

      <FormLabel>Latitude & longitude:</FormLabel>
      <input type="text" disabled value={[inputs.latitude, inputs.longitude] || ""} onChange={() => {}} />
      </div>

      <Button colorScheme='purple' onClick={handleSave}>Save Changes</Button>
      {successMessage && <div className="success">{successMessage}</div>}
    {errorMessage && <div className="error">{errorMessage}</div>}
    </> }
    </div>
    }
    </div>
  );
};

export default ShopEdit;
