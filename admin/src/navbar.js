// Navbar.js
import React from 'react';
import { ChakraProvider, Box, Flex, extendTheme, Link as ChakraLink, Image } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import logo from "./logo.png";

const theme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
});

const Navbar = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box bg="#53389E" p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <ReactRouterLink to="/" style={{ fontSize: 'xl', color: 'white', fontWeight: 'bold', display: 'flex', gap: '2px', alignItems: 'center' }}>
            <Image src={logo} alt="Logo" h="1.5rem" mr={"4px"} />
            <span>Naitik</span>
          </ReactRouterLink>
          <Flex>
            <ChakraLink as={ReactRouterLink} to="/review" color="white" ml="4">
              Review
            </ChakraLink>
            <ChakraLink as={ReactRouterLink} to="/" color="white" ml="4">
              Monitor
            </ChakraLink>
          </Flex>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Navbar;
