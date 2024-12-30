/* eslint-disable react/prop-types */
import { Badge } from "@chakra-ui/layout";
import { LuTrash} from "react-icons/lu";
import { Text } from "@chakra-ui/react";
const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
    fontFamily='Fira sans'
    size="lg"
      px={4}
      py={6}
      borderRadius='5'
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      display='flex'
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
      backgroundColor='#34c8bc'
      flexDirection='row'
    >
     <Text fontWeight='bold' ml={1} mr={1} color='black'>{user.name}</Text>
      {admin === user._id && <span> (Admin)</span>}
      <LuTrash color='black' size={16} p={4} />
    </Badge>
  );
};

export default UserBadgeItem;
