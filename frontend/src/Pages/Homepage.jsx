import { Container, Box, Text,Image } from "@chakra-ui/react";
import Demo from "./InTabs";
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
const Homepage = () => {
const navigate=useNavigate();
useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));

    if(!userInfo)
    {
        navigate('/chats')
    }
},[navigate]);

  return (
    <Container
    fontFamily='Fira Sans'
      maxW="lg"
      centerContent
      // A background gradient to show off translucency
      bgGradient="linear(to-r, purple.500, pink.500)"
      minH="100vh"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        bg="white" 
      >
        <Text fontSize="4xl"  color="black">
          Talk-A-Tive
        </Text>
        <Image
        src="images/talk-a-TIVE.png"
        boxSize="80px"
        borderRadius="full"
        fit="cover"
        alt="Logo"
      />
      </Box>
      <Box
        p={4}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="white" 
        bg="whiteAlpha.200"
        backdropFilter="auto"    // or "auto"
        backdropBlur="8px"       // the higher the value, the stronger the blur
        color="black"
      >
        <Demo />
      </Box>
    </Container>
  );
};

export default Homepage;
