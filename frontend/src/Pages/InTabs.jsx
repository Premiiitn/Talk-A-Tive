import { Tabs } from "@chakra-ui/react";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import  Login from '../components/authentication/Login';
import  Signup from '../components/authentication/Signup';
function Demo() {
  return (
    <Tabs.Root defaultValue="login" variant="plain">
      {/* Tab Triggers Container */}
      <Tabs.List
       fontFamily='Fira Sans'
        display="flex"
        width="100%"
        gap="4"                  // Adds space between tabs
        justifyContent="center"
        background="transparent" // No background
        p="4"
        position="relative"
         borderBottom="5px solid white transparent"       // Required for the indicator to align properly
      >
        {/* Login Tab */}
        <Tabs.Trigger
          value="login"
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="2"
          px="4"
          py="2"
          rounded="md"
          fontWeight="medium"
          color="white"
          border="2px solid transparent" // Default no visible border
          _hover={{
            borderColor: "whiteAlpha.400",
          }}
          _selected={{
            borderColor: "white", // White border on selection
          }}
        >
          <LuLogIn />
          Login
        </Tabs.Trigger>

        {/* Signup Tab */}
        <Tabs.Trigger
          value="signup"
          flex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="2"
          px="4"
          py="2"
          rounded="md"
          fontWeight="medium"
          color="white"
          border="2px solid transparent"
          _hover={{
            borderColor: "whiteAlpha.400",
          }}
          _selected={{
            borderColor: "white",
          }}
        >
          <LuUserPlus />
          Signup
        </Tabs.Trigger>

        {/* White Line (Indicator) */}
        <Tabs.Indicator
          height="2px"
          bg="white" // White color for the indicator
          position="absolute"
          bottom="0" // Ensure it aligns at the bottom
          rounded="full" // Slightly rounded for smoothness
        />
      </Tabs.List>

      {/* Content for each tab */}
      <Tabs.Content value="login" p="4" color="white" textAlign="center">
        <Login/>
      </Tabs.Content>
      <Tabs.Content value="signup" p="4" color="white" textAlign="center">
        <Signup/>
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default Demo;
