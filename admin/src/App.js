import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Review from './Review';
import Monitor from './Monitor';
import Dashboard from './Dashboard';
function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
