import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {VStack, Table, Thead, Tbody, Tr, Th, Td, Button, Image, Select } from '@chakra-ui/react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import Navbar from './navbar';

const DarkPatternsList = () => {
  const [patterns, setPatterns] = useState([]);
  const [chartData, setChartData] = useState(null);
 useEffect(() => {
    axios.get('http://localhost:5000/monitor')
      .then(response => {
        setPatterns(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  const getChartData = (id) => {
    axios.post('http://localhost:5000/monitor', { id })
      .then(response => {
        setChartData(response.data);
      })
      .catch(error => {
        console.error('Error fetching chart data:', error);
      });
  };


  return (
    <VStack spacing={4} align="stretch">
      <Navbar/>
      {chartData && (
          <Line data={chartData}/>
        )}
    <div style={{ margin: '4rem auto', width: '80%' }}>
    <Table variant="simple">
      <Thead>
      <Tr style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Website Name</Th>
          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Forced Action</Th>
          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Misdirection</Th>
          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Obstruction</Th>
          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Scarcity</Th>
          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Sneaking</Th>
          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Social Proof</Th>
          <Th style={{ backgroundColor: '#2c3e50', color: '#FFF', important: 'true' }}>Urgency</Th>
        </Tr>
      </Thead>
      <Tbody>
      <Tbody>
            {patterns.map(pattern => (
              <Tr key={pattern.id}>
                <Td>
                  <Button colorScheme="blue" onClick={() => getChartData(pattern.id)}>
                    {pattern.websiteName}
                  </Button>
                </Td>
                <Td>{pattern.forcedAction}</Td>
                <Td>{pattern.misdirection}</Td>
                <Td>{pattern.obstruction}</Td>
                <Td>{pattern.scarcity}</Td>
                <Td>{pattern.sneaking}</Td>
                <Td>{pattern.socialProof}</Td>
                <Td>{pattern.urgency}</Td>
              </Tr>
            ))}
          </Tbody>
      </Tbody>
    </Table>
    </div>

    </VStack>

  );
};

export default DarkPatternsList