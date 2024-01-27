import React from 'react';
import {
  ChakraProvider,
  Box,
  theme,
} from '@chakra-ui/react';
import DarkPatternsList from './darj';

function Review() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
          <DarkPatternsList/>
      </Box>
    </ChakraProvider>
  );
}

export default Review;