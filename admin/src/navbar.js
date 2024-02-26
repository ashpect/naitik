import React, { useState } from 'react';
import { ChakraProvider, Box, Flex, extendTheme, Link as ChakraLink, Image, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, useDisclosure } from '@chakra-ui/react';
import { Link as ReactRouterLink, useLocation } from 'react-router-dom'; // Import useLocation
import { HamburgerIcon } from '@chakra-ui/icons';
import logo from "./logo.png";

const theme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
});

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation(); // Get current location

  return (
    <ChakraProvider theme={theme}>
      <Box bg="#FFFFFF" p={4} boxShadow="base">
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center">
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="ghost"
              colorScheme="blackAlpha"
              mr={2}
            />
            <ReactRouterLink to="/" style={{ fontSize: 'xl', color: '#53389E', fontWeight: 'bold', display: 'flex', gap: '2px', alignItems: 'center' }}>
              <Image src={logo} alt="Logo" h="1.5rem" mr={"4px"} />
              <span color='#53389E'>Naitik</span>
            </ReactRouterLink>
          </Flex>
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader color='#53389E'>  
              <span>Naitik</span>
              </DrawerHeader>
              <DrawerBody>
                <Flex flexDirection="column" alignItems="left">
                  <ChakraLink as={ReactRouterLink} to="/" p="2" borderRadius="8px" color={location.pathname === '/' ? '#FFFFFF' : '#000'} bg={location.pathname === '/' ? '#4880FF' : 'transparent'} mt="4" onClick={onClose}>
                    Dashboard
                  </ChakraLink>
                  <ChakraLink as={ReactRouterLink} to="/monitor" color={location.pathname === '/monitor' ? '#FFFFFF' : '#000'} bg={location.pathname === '/monitor' ? '#4880FF' : 'transparent'} mt="4" p="2" borderRadius="8px" onClick={onClose}>
                    Websites
                  </ChakraLink>
                  <ChakraLink as={ReactRouterLink} to="/review" color={location.pathname === '/review' ? '#FFFFFF' : '#000'} bg={location.pathname === '/review' ? '#4880FF' : 'transparent'} mt="4" p="2" borderRadius="8px" onClick={onClose}>
                    Report Lists
                  </ChakraLink>
                  <DrawerHeader color="#979797" mt="4" onClick={onClose} fontWeight="bold" fontSize="1rem">Accounts</DrawerHeader>
                  <ChakraLink p="2" as={ReactRouterLink} to="/settings" color="#000" mt="4" onClick={onClose}>
                    Settings
                  </ChakraLink>
                  <ChakraLink p="2" as={ReactRouterLink} to="/logout" color="#000" mt="4" onClick={onClose}>
                    Logout
                  </ChakraLink>
                </Flex>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Navbar;
