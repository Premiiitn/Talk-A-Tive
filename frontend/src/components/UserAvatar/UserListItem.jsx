/* eslint-disable react/prop-types */
import { Avatar } from "@/components/ui/avatar"
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user,handleFunction }) => {

  return (
    <Box
    fontFamily='Fira sans'
      onClick={handleFunction}
      cursor="pointer"
      bg="#454545"
      _hover={{
        background: "gray",
        //color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={8}
      borderRadius="10"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        mt={2}
        mb={2}
        ml={2}
      />
      <Box>
        <Text color='white' fontFamily='Fira Sans' fontSize='medium' fontWeight='bold'>{user.name}</Text>
        <Text fontFamily='Fira Sans' fontSize="xs" display="flex">
          Email : {user.email} 
          
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
