// Navbar.js
import React from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Spacer,
  Link,
  extendTheme,
} from '@chakra-ui/react';

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
          <Link href="#" fontSize="xl" color="white" fontWeight="bold">
            Naitik
          </Link>
          <Spacer />
          <Link href="#" color="white">
            Review
          </Link>
          <Link href="#" color="white" ml={4}>
            Monitor
          </Link>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Navbar;
