// Navbar.js
import React from 'react';
import { ChakraProvider, Box, Flex, Spacer, extendTheme } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

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
      <Box bg="teal.500" p={4}>
        <Flex alignItems="center">
          <ReactRouterLink to="/" style={{ fontSize: 'xl', color: 'white', fontWeight: 'bold' }}>
            Naitik
          </ReactRouterLink>
          <Spacer />
          <ReactRouterLink to="/review" style={{ color: 'white', marginLeft: '4rem' }}>
            Review
          </ReactRouterLink>
          <ReactRouterLink to="/" style={{ color: 'white', marginLeft: '4rem' }}>
            Monitor
          </ReactRouterLink>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Navbar;
