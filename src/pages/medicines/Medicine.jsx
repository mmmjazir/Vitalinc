import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import Loading from '../../components/loading/Loading';
import {
  Box,
  Text,
  Flex,
  Button,
  Link as ChakraLink,
  Image,
  Icon,
  HStack,
  VStack,
  Badge,
  Divider,
  Heading,
  SimpleGrid,
} from '@chakra-ui/react';
import { InfoIcon } from "@chakra-ui/icons";
import { FaMapMarkedAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Medicine = () => {
  const [publicmedicine, setPublicMedicine] = useState([]);
  const [publicshop, setPublicShop] = useState([]);

  const { user } = useAuthContext();
  const { id } = useParams();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicinesForAll() {
      try {
        const response = await fetch(`http://localhost:4000/api/publicmedicines/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error);
        }
        if (response.ok) {
          setError(null);
          setPublicMedicine(json);
        }
      } catch (error) {
        console.error('Error occurred while fetching medicine data:', error);
      }
    }

    async function fetchShopsForAll() {
      if (publicmedicine && publicmedicine.shop_id) {
        try {
          const response = await fetch(`http://localhost:4000/api/publicshops/${publicmedicine.shop_id}`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const json = await response.json();

          if (!response.ok) {
            setError(json.error);
          }

          if (response.ok) {
            setError(null);
            setPublicShop(json);
          }
        } catch (error) {
          console.error('Error occurred while fetching shop data:', error);
        }
      }
    }

    if (user) {
      // Use Promise.all to fetch both data simultaneously
      Promise.all([fetchMedicinesForAll(), fetchShopsForAll()])
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [user, id, publicshop, publicmedicine]);

  const openGoogleMaps = ({ lat, lng }) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <Box
      p="4"
      bg='gray.300'
      borderRadius="lg"
      boxShadow="lg"
      color="white"
      h='90vh'
    >
      {isLoading ? (
        <Loading />
      ) : (
        publicshop &&
        publicmedicine && (
          <VStack
            align="start"
            spacing={8}
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            bg='purple.400'
           
            color="teal.800"
          >
            <Box color='white' >
              {publicmedicine.imageUrl ? (
                <Image
                  src={publicmedicine.imageUrl}
                  alt={publicmedicine.medicinename}
                  bg='purple'
                  maxH="300px"
                  maxW="100%"
                  mb="4"
                  borderRadius="lg"
                />
              ) : null}
              <Heading fontSize="2xl" fontWeight="semibold">
               {publicmedicine.medicinename}
              </Heading>
              <Text fontSize="lg"> <InfoIcon/> {''}{publicmedicine.medicinedetails}</Text>
              <HStack bg='white' p='7px' marginRight='100px' borderRadius='20px' spacing="2" >
                {publicmedicine.available ? (
                  <>
                    <Icon as={FaCheckCircle} color="green.500" />
                    <Text  color="green.500">Available</Text>
                  </>
                ) : (
                  <>
                    <Icon as={FaTimesCircle} color="red.500" />
                    <Text color="red.500">Unavailable</Text>
                  </>
                )}
              </HStack>
              <Text fontSize="xl" fontWeight="semibold">
              <InfoIcon/> {''} Price Per Unit: ₹{publicmedicine.price}
              </Text>
            </Box>
            <Divider my="2" />
            <Box color='white' >
              <Heading fontWeight="semibold">
                Shop Details
              </Heading>
              <VStack align="start" spacing={2}>
                <Text fontSize="lg">{publicshop.shopname}</Text>
                <Text fontSize="lg">Address: {publicshop.address}</Text>
                <HStack spacing={2}>
                  
                  <Button
                    leftIcon={<Icon as={FaMapMarkedAlt} />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => openGoogleMaps({ lat: publicshop.latitude, lng: publicshop.longitude })}
                  >
                    View on Google Maps
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        )
      )}
    </Box>
  );
};

export default Medicine;
