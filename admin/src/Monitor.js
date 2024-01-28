import React from 'react';
import {
  ChakraProvider,
  Box,
  theme,
} from '@chakra-ui/react';
import Bruh from './bruh';
function Monitor() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
          <Bruh/>
      </Box>
    </ChakraProvider>
  );
}

export default Monitor;