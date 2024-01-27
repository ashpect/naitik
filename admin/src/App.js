import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Review from './Review';
import Monitor from './Monitor';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Monitor />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
