import React from 'react';
import {
  ChakraProvider,
  Box,
  theme,
} from '@chakra-ui/react';
import DarkPatternsList from './report';

function Review() {
  return (
    <ChakraProvider theme={theme}>
      <Box  fontFamily={'Nunito Sans'} textAlign="center" fontSize="xl">
          <DarkPatternsList/>
      </Box>
    </ChakraProvider>
  );
}

export default Review;