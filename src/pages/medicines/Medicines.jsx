import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePublicMedicineContext } from '../../hooks/usePublicMedicineContext'
import Loading from "../../components/loading/Loading";
import { useCitySorting } from "../../hooks/useCitySorting/useCitySorting";
import {
  Box,
  Button,
  Input,
  Text,
  Link as ChakraLink,
  Stack,
  Grid,
  Flex,
  IconButton,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon,CloseIcon } from "@chakra-ui/icons";
import { MdGpsFixed } from 'react-icons/md';

const Medicines = () => {
    const { user } = useAuthContext();
    const {publicmedicines, dispatch:publicMedicineDispatch} = usePublicMedicineContext()
    
    const {cities} = useCitySorting();
      // State to store the user's location
      const [userLocation, setUserLocation] = useState(null);
    
      // State to store the search query
      const [searchQuery, setSearchQuery] = useState("");
    
      // State to toggle search mode
      const [searchMode, setSearchMode] = useState(false);
    
      // State to store the selected city
      const [selectedCity, setSelectedCity] = useState("");
    
      // State for city suggestions
      const [citySuggestions, setCitySuggestions] = useState([]);
    
      // State to show/hide city suggestions
      const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    
      // State to store the sorting method
      const [sortingMethod, setSortingMethod] = useState("");
      
      const [loading, setLoading] = useState(true); 
      const [medicinesFetched, setMedicinesFetched] = useState(false);
  const [locationButtonActive, setLocationButtonActive] = useState(false);
 

 
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchQuery(inputValue);
    setSearchMode(false)
  };

  const handleCityInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSelectedCity(inputValue);
    setSearchMode(false)
    // Filter the cities based on the input value
    const filteredCities = cities.filter(city =>
      city.toLowerCase().includes(inputValue)
    );
    setCitySuggestions(filteredCities);

    // Show city suggestions when the input is focused
    setShowCitySuggestions(true);
  };

  const handleCitySuggestionClick = (city) => {
    setSelectedCity(city);

    setLocationButtonActive(false)
    setUserLocation(null);
    // Hide city suggestions when a suggestion is clicked
    setShowCitySuggestions(false);
    // Set the sorting method to "city"
    setSortingMethod("city");
    // Call setSearchMode to trigger filtering
    setSearchMode(true);
  };

  const askForLocation = () => {
    setLocationButtonActive(false)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // Clear the selected city when accessing user location
          setSelectedCity("");
          // Set the sorting method to "location"
          setSortingMethod("location");
          // Call setSearchMode to trigger filtering
          setSearchMode(true);
          setCitySuggestions([]);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  };



  useEffect(() => {
    const fetchMedicinesForAll = async () => {
      try {
        const response = await fetch("https://appbackend-lake.vercel.app/api/publicmedicines", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        if (response.ok) {
          const json = await response.json();
          publicMedicineDispatch({ type: "SET_PUBLIC_MEDICINES", payload: json });
          setMedicinesFetched(true); // Set medicinesFetched to true after successful fetch
        } else {
          console.error("Failed to fetch shop data:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error while fetching medicines:", error);
      } finally {
        setLoading(false); // Always set loading to false after fetch (whether success or error)
      }
    };
  
    if (user) {
      fetchMedicinesForAll();
    }
  }, [publicMedicineDispatch, user]);

  useEffect(() => {
    const fetchShopDetailsForMedicines = async () => {
      if ( publicmedicines && publicmedicines.length > 0) {
        const medicinesWithShopDetails = await Promise.all(
          publicmedicines.map(async (medicine) => {
            const shopResponse = await fetch(
              `https://appbackend-lake.vercel.app/api/shops/${medicine.shop_id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            const shopJson = await shopResponse.json();

            // Calculate the distance between user and shop
            const distance = userLocation
              ? calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  shopJson.latitude,
                  shopJson.longitude
                )
              : null;

            return {
              ...medicine,
              shop_address: shopJson.address,
              shop_distance: distance,
              shop_city: shopJson.city,
            };
          })
        );

        publicMedicineDispatch({ type: "SET_PUBLIC_MEDICINES", payload: medicinesWithShopDetails });
      }
    };
    if(user){
      fetchShopDetailsForMedicines();
    }
    
  }, [publicMedicineDispatch, publicmedicines, user, userLocation]);

  // Function to handle search button click
  const handleSearchClick = () => {
    setLocationButtonActive(false)
    setSortingMethod("");
    setSearchMode(true);
  };

  // Function to handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchMode(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowCitySuggestions(false);
    }, 200);
  };

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Radius of the Earth in km
    const R = 6371;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Filter medicines based on the selected state, search query, and selected city
  const filteredMedicines = publicmedicines && searchMode === true && publicmedicines.length > 0
    ? publicmedicines.filter((medicine) => {
      const includesSearchQuery = medicine.medicinename.toLowerCase().includes(searchQuery.toLowerCase());
      const isWithin4KmRadius = medicine.shop_distance <= 4; // 4km radius

      // Check if a city is selected and if it matches the medicine's shop_city
      const isMatchingCity = !selectedCity || selectedCity.toLowerCase() === medicine.shop_city.toLowerCase();

      return includesSearchQuery && isWithin4KmRadius && isMatchingCity;
    })
    : publicmedicines;

  // Sort medicines based on the selected sorting method
  const sortMedicines = (medicinesToSort) => {
    if (sortingMethod === "location") {
      return medicinesToSort.slice().sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.shop_latitude,
          a.shop_longitude
        );
        const distanceB = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.shop_latitude,
          b.shop_longitude
        );

        return distanceA - distanceB;
      });
    } else if (sortingMethod === "city") {
      return medicinesToSort.slice().sort((a, b) => {
        return a.shop_city.localeCompare(b.shop_city);
      });
    } else {
      return medicinesToSort;
    }
  };

  const sortedMedicines = sortMedicines(filteredMedicines);


  return (
    <Box bg='gray.300' minH='90vh' p="4">
      {user && (
          <Stack spacing="4" direction="column">
           <Flex  justifyContent="space-between" maxW='180vh' align="center">
           <Box flex="1" >
          <Input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={handleInputChange}
            bg='white'
          />
           </Box>
           <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          colorScheme="purple"
          onClick={handleSearchClick}
        />
        {searchMode && (
          <IconButton
            aria-label="Clear Search"
            icon={<Icon as={CloseIcon} />}
            colorScheme="red"
            onClick={handleClearSearch}
          />
        )}
      </Flex>
    


   
    <Flex align="center">
    
    <Button
    leftIcon={<MdGpsFixed />}
    colorScheme={locationButtonActive ? "purple" : "gray"}
    onClick={askForLocation}
    size='sm'
    >
    </Button>
    </Flex>
    {showCitySuggestions && (
    <Box 
     mt='128px' p="2" border="1px solid #ccc"
     maxH="200px" maxW='170px' minW='150px' overflowY="auto" 
     zIndex="1"
     bg="white"
     autoComplete="off"
    position="absolute"
    >
   {citySuggestions.map((city, index) => (
              <Box
               className="city-suggestions"
                key={index} 
                _hover={{bg: 'lightgrey'}}
                onClick={() => handleCitySuggestionClick(city)}
              >
                {city}
              </Box>
            ))}
    </Box>
    )}
   
    <Divider my="2" />

    <Grid  
    templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
    gap="4"
    >
    {loading && user ? (
    <Loading />
    ) : medicinesFetched && user && sortedMedicines.length > 0 ? (
    sortedMedicines.map((medicine) => (
    <ChakraLink bg='white'  borderRadius='20px'
    _hover={{
      textDecoration: 'none', // Remove underline on hover
    }}
      as={RouterLink}
      to={`/medicines/${medicine._id}`}
      key={medicine._id}
    >
      <Box
        overflow="hidden"
        p="4"
      >
        <Box
          h="150px"
          bg="gray.200"
          bgImage={`url(${medicine.imageUrl})`}
          bgSize="cover"
          bgGradient="linear(to-r, teal.200, teal.500)"
          borderRadius='20px'
          bgPosition="center"
        ></Box>
        <Box mt="4">
          <Text fontSize="xl" fontWeight="semibold">
            {medicine.medicinename}
          </Text>
          <Text fontSize="md">{medicine.medicinedetails}</Text>
          <Text color={medicine.available ? "green.600" : "red.600"} fontSize="xl">{medicine.available ? "Available" : "Currently Unavailable"}</Text>
        </Box>
        <Box mt="4" textAlign="right">
          <Text fontSize="lg" fontWeight="semibold">
            ₹{medicine.price}
          </Text>
        </Box>
      </Box>
    </ChakraLink>
    ))
    ) : (
    user && (
    <Text>
      {searchMode && filteredMedicines.length === 0
        ? "No matching medicines found"
        : "No medicines found"}
    </Text>
    )
    )}
    </Grid>
    </Stack>
    )}

    {!user && (
    <Box mt="4">
    <Text>
    User must be logged in to see the content
    <ChakraLink as={RouterLink} to="/login" color="teal.500" ml="1">
    Login here
    </ChakraLink>
    </Text>
    </Box>
    )}
    </Box>

  );
};

export default Medicines;
