/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
  import { useDisclosure } from '@chakra-ui/hooks'
  import { Button } from "@/components/ui/button"
  import { IconButton ,Text,Image,Box} from '@chakra-ui/react';
 import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/modal'
 import { LuBadge, LuBell, LuCircleUser, LuCircleUserRound, LuPersonStanding, LuView } from 'react-icons/lu';
const ProfileModal = ({user,children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
     {children ?(<Box onClick={onOpen}>{children}</Box> )
     :(
        <IconButton display={{base:"flex"}} 
        onClick={onOpen}>
          <LuCircleUserRound></LuCircleUserRound>
        </IconButton>
     )} 

<Modal size="md" onClose={onClose} isOpen={isOpen} isCentered>
  <ModalOverlay />
  <ModalContent
        bg="black"
    color="white"
    borderRadius='10'
    p="6"
     marginTop='200'
     marginLeft='575'
    maxW='400px' // Ensures responsiveness on smaller screens
    boxShadow="lg"
    //textAlign="center"
    fontFamily='Fira sans'
    alignItems="center"
  >
    {/* Modal Header */}
    <ModalHeader fontSize="2xl"  p='5' display="flex" justifyContent="center">
      {user.name}
    </ModalHeader>

    {/* Modal Body */}
    <ModalBody
    display="flex"
    flexDir='column'
    alignItems="center"
        justifyContent="space-between"
    >
      <Image
        borderRadius="full"
        boxSize="120px"
        // marginLeft='20'
        marginTop='3'
        src={user.pic}
        alt={user.name}
        border="3px solid white"
      />
      <Text fontSize="lg"  p='4'>
        Email: {user.email}
      </Text>
    </ModalBody>

    {/* Modal Footer */}
    <ModalFooter justifyContent="center" mb='10'>
      <Button onClick={onClose} colorScheme="blue">
        Close
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>




    </>
  )
}

export default ProfileModal
