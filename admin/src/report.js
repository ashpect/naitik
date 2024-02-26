import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Table, Thead, Tbody, Tr, Th, Td, Button, Image, Select,HStack } from '@chakra-ui/react';
import Navbar from './navbar';

const DarkPatternsList = () => {
  const [patterns, setPatterns] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/report')
      .then(response => {
        setPatterns(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 
  const handleApprove = (id, website_name, img, htmlcontent, tag) => {
    axios.post('http://localhost:5000/approve', { id, website_name, img, htmlcontent, tag })
      .then(response => {
        console.log('Approval successful:', response.data);
        axios.get('http://localhost:5000/report')
          .then(response => {
            setPatterns(response.data);
          })
          .catch(error => {
            console.error('Error fetching data after approval:', error);
          });
      })
      .catch(error => {
        console.error('Error approving pattern:', error);
      });
  };
  const handleChange = (id, selectedTag) => {
    setPatterns(prevPatterns =>
      prevPatterns.map(pattern =>
        pattern.id === id ? { ...pattern, tag: selectedTag } : pattern
      )
    );
  };
  const websiteNames = patterns.map(pattern => pattern.website_name);  const occurrences = websiteNames.reduce((acc, website) => {
    acc[website] = (acc[website] || 0) + 1;
    return acc;
  }, {});

  return (
    <HStack spacing={4} align="stretch">
      <Navbar/>
    <div style={{ margin: '4rem auto', width: '80%' }}>
    <Table variant="simple">
      <Thead>
      <Tr style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Website Name</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Website Image</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Reported Tag</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Tag</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>HTML Content</Th>
          <Th style={{ backgroundColor: '#53389E', color: '#FFF', important: 'true' }}>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {patterns.map(pattern => (
          <Tr key={pattern.id } style={{ borderBottom: '1px solid #ddd' }}>
            <Td><a href={pattern.website_name} style={{ textDecoration: 'underline', color:"white" }}>{pattern.website_name}</a></Td>
            <Td>
              <Image src={`data:image/jpg;base64,${pattern.img}`} alt={pattern.website_name} maxH="100px" />
            </Td>
            <Td>{pattern.tag}</Td>
            <Td>
              <Select value={pattern.tag} onChange={(e) => handleChange(pattern.id, e.target.value)}>
                <option value="Forced Action">Forced Action</option>
                <option value="Misdirection">Misdirection</option>
                <option value="Not Dark Pattern">Not Dark Pattern</option>
                <option value="Obstruction">Obstruction</option>
                <option value="Scarcity">Scarcity</option>
                <option value="Sneaking">Sneaking</option>
                <option value="Social Proof">Social Proof</option>
                <option value="Urgency">Urgency</option>
              </Select>
            </Td>
            <Td>{pattern.htmlcontent}</Td>
            <Td>
              <Button onClick={() => handleApprove(pattern.id, pattern.website_name, pattern.img, pattern.htmlcontent, pattern.tag)} colorScheme="purple" size="sm">Submit</Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
    </div>
    </HStack>

  );
};

export default DarkPatternsList