import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {VStack, Table, Thead, Tbody, Tr, Th, Td, Button, Image, Select } from '@chakra-ui/react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import Navbar from './navbar';

const Bruh = () => {
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

  const getChartData = (website_name) => {
    axios.post('http://localhost:5000/monitor', {website_name})
      .then(response => {
        setChartData(response.data);
        console.log(chartData)
      })
      .catch(error => {
        console.error('Error fetching chart data:', error);
      });
  };

  if(chartData){
    let dates = chartData.map(entry => entry.date)
}
  return (
    <VStack spacing={4} align="stretch">
      <Navbar/>
      {chartData && (
        <div style={{height:"40rem", margin:"4rem",display:"flex",alignItems:"center", justifyContent:"center"}}>
   <Line
   data={{
     labels: chartData.map(entry => entry.date),
     datasets: Object.keys(chartData[0]).filter(key => key !== 'date').map(category => ({
       label: category,
       data: chartData.map(entry => entry[category]),
     })),
   }}
 />
 </div>
    )}
    <div style={{ margin: '4rem auto', width: '80%' }}>
    <Table variant="simple">
      <Thead>
      <Tr style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>          
            <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Website Name</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Forced Action</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Misdirection</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Obstruction</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Scarcity</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Sneaking</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Social Proof</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Urgency</Th>
        </Tr>
      </Thead>
      <Tbody>
            {patterns.map(pattern => (
              <Tr key={pattern.id}>
                <Td>
                  <Button style={{backgroundColor:"#53389E"}} onClick={() => getChartData(pattern.website_name)}>
                    {pattern.website_name}
                  </Button>
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

    </VStack>

  );
};

export default Bruh