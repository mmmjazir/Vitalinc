import React from 'react';
import { Box, Heading, Text, Container, Image, SimpleGrid } from '@chakra-ui/react';

const Home = () => {
  return (
    <Container maxW="container.xl" centerContent>
      <Box
        bgImage="url('homebg.jpg')" // Replace with your background image URL
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        w="200vh"
        h="91vh"
        position="relative"
      >
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          alignItems="center"
          px={4}
          py={12}
          gap={6}
        >
          <Box>
            <Heading fontSize={{ base: '2xl', md: '4xl' }} color="white">
              Welcome to Vitalinc
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="white"
              mt={4}
              opacity={0.9}
            >
              Discovering Medicines Made Easy. Vitalinc is your trusted companion for quickly and effortlessly locating the right medications for your needs. With an extensive and up-to-date database, we help you find the right medicines, compare alternatives, and even locate nearby pharmacies, all in one seamless experience. Say goodbye to the hassle of searching through various sources - We simplify your healthcare journey.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  );
}

export default Home;
