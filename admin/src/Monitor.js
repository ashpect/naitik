import React from 'react';
import {
  ChakraProvider,
  Box,
  theme,
} from '@chakra-ui/react';
import Bruh from './mon';
function Monitor() {
  return (
    <ChakraProvider theme={theme}>
      <Box fontFamily={'Nunito Sans'} textAlign="center" fontSize="xl">
          <Bruh/>
      </Box>
    </ChakraProvider>
  );
}

export default Monitor;