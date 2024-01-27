import React from 'react';
import {
  ChakraProvider,
  Box,
  theme,
} from '@chakra-ui/react';
import DarkPatternsList from './darj';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
          <DarkPatternsList/>
      </Box>
    </ChakraProvider>
  );
}

export default App;
