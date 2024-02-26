import React from 'react';
import { Box, Heading, Text, Flex,Image } from '@chakra-ui/react';

function Card({ heading, number, percentage, icon, iconColor }) {
  const percentageColor = percentage < 0 ? "red" : "green";
  const numberFontSize = "1.5rem"; // Font size of the number, adjust as needed

  return (
    <Box fontFamily={'Nunito Sans'} textAlign="center">
      <Flex alignItems="center" justifyContent="space-between">
        <Box textAlign="left">
          <Heading as="h2" color="#979797" fontSize="1rem" mb={1} fontWeight="semibold">
            {heading}
          </Heading>
          <Text fontSize={numberFontSize} fontWeight="bold" color="#000" fontFamily="Arial">
            {number.toLocaleString()}
          </Text>
        </Box>
        <Box>
          <Image src={icon} w="33px" />
        </Box>
      </Flex>
      <Text mt={2} color="#979797" fontWeight="semibold">
          <span style={{ color: percentageColor }}>{Math.abs(percentage)}%</span> {percentage < 0 ? "Down" : "Up"} from yesterday
      </Text>
    </Box>
  );
}

export default Card;
