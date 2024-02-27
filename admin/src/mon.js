import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {HStack, Table, Thead, Tbody, Tr, Th, Td, Button, Image, Select } from '@chakra-ui/react';
import Navbar from './navbar';

const Bruh = () => {
  const [patterns, setPatterns] = useState([]);
 useEffect(() => {
    axios.get('http://localhost:5000/monitor')
      .then(response => {
        setPatterns(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  return (
    <HStack spacing={4} align="stretch">
      <Navbar/>
    <div style={{ margin: '4rem auto', width: '80%' }}>
    <Table variant="simple">
      <Thead>
      <Tr style={{ color: '#000', important: 'true' }}>          
            <Th style={{  color: '#000', important: 'true' }}>Website Name</Th>
          <Th style={{color: '#000', important: 'true' }}>Forced Action</Th>
          <Th style={{  color: '#000', important: 'true' }}>Misdirection</Th>
          <Th style={{ color: '#000', important: 'true' }}>Obstruction</Th>
          <Th style={{ color: '#000', important: 'true' }}>Scarcity</Th>
          <Th style={{  color: '#000', important: 'true' }}>Sneaking</Th>
          <Th style={{  color: '#000', important: 'true' }}>Social Proof</Th>
          <Th style={{ color: '#000', important: 'true' }}>Urgency</Th>
        </Tr>
      </Thead>
      <Tbody>
            {patterns.map(pattern => (
              <Tr key={pattern.id}>
                <Td>
                  <b>
                    {pattern.website_name}
                    </b>
                </Td>
                <Td>{pattern.forced_action}</Td>
                <Td>{pattern.misdirection}</Td>
                <Td>{pattern.obstruction}</Td>
                <Td>{pattern.scarcity}</Td>
                <Td>{pattern.sneaking}</Td>
                <Td>{pattern.social_proof}</Td>
                <Td>{pattern.urgency}</Td>
              </Tr>
            ))}
          </Tbody>
    </Table>
    </div>

    </HStack>

  );
};

export default Bruh