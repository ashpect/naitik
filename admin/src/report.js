import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td, Button, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select } from '@chakra-ui/react';
import Navbar from './navbar';

const DarkPatternsList = () => {
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  
  const primaryButton = {
    backgroundColor:"rgba(0,182,155,0.2)",
    color:"#00B69B",
    padding:"0.5rem",
    borderRadius:"8px",
    marginRight:"8rem"
  }
  const secondaryButton = {
    backgroundColor:"rgba(239,56,38,0.2)",
    color:"#EF3826",
    padding:"0.5rem",
    borderRadius:"8px"
  } 

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
    setSelectedPattern({ id, website_name, img, htmlcontent, tag });
    setIsModalOpen(true);
  };

  const handleChange = (id, selectedTag) => {
    setPatterns(prevPatterns =>
      prevPatterns.map(pattern =>
        pattern.id === id ? { ...pattern, tag: selectedTag } : pattern
      )
    );
  };

  const handleAction = (approve) => {
    if (selectedPattern) {
      axios.post('http://localhost:5000/approve', {
        id: selectedPattern.id,
        website: selectedPattern.website_name,
        img: selectedPattern.img,
        htmlcontent: selectedPattern.htmlcontent,
        tag: selectedPattern.tag,
        approve: approve
      })
      .then(response => {
        console.log(`Pattern ${selectedPattern.id} ${selectedAction}`);
        setIsModalOpen(false);
        setSelectedPattern(null);
        setSelectedAction('');
      })
      .catch(error => {
        console.error('Error handling action:', error);
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Navbar/>
      <div style={{ textAlign: 'left', color: '#000', fontSize: '1.5rem', fontWeight: 'bold', alignSelf: 'left', marginLeft: "4rem", marginTop: "2rem" }}>Reported Patterns</div>
      <div style={{ margin: '4rem auto', width: '80%' }}>
        <Table variant="simple">
          <Thead>
            <Tr style={{ important: 'true' }}>   
              <Th style={{ color:"#000000", important: 'true' }}>ID</Th>
              <Th style={{ color:"#000000", important: 'true' }}>Webpage</Th>
              <Th style={{ color:"#000000", important: 'true' }}>Description</Th>
              <Th style={{ color:"#000000", important: 'true' }}>Date</Th>
              <Th style={{ color:"#000000", important: 'true' }}>Type</Th>
              <Th style={{ color:"#000000", important: 'true' }}>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {patterns.map(pattern => (
              <Tr key={pattern.id} style={{ borderBottom: '1px solid #ddd' }}>
                <Td> {pattern.id}</Td>
                <Td><a href={pattern.website_name} style={{ textDecoration: 'underline', color:"black" }}>{pattern.website_name}</a></Td>
                <Td>{pattern.htmlcontent}</Td>
                <Td>{pattern.date}</Td>
                <Td>{pattern.tag}</Td>
                <Td>
                  <Button style={{ backgroundColor:"rgba(98,38,239,0.2)", color:"#6226EF" }} onClick={() => handleApprove(pattern.id, pattern.website_name, pattern.img, pattern.htmlcontent, pattern.tag)} colorScheme="purple" size="sm">Resolve</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Approve or Reject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Is the dark pattern being reported a valid dark pattern?
            <div style={{ textAlign: 'center', marginTop:"2rem" }}>
              <button style={primaryButton} onClick={() => { handleAction(true) }}>Approve</button>
              <button style={secondaryButton} onClick={() => { handleAction(false) }}>Reject</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default DarkPatternsList;
