/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
 import { useDisclosure } from '@chakra-ui/hooks'
 import { Button } from "@/components/ui/button"
import { Toaster, toaster } from "@/components/ui/toaster"
import { Input } from "@chakra-ui/input";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import axios from "axios";
import { FormControl } from "@chakra-ui/form-control";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { LuCircleUser, LuCircleUserRound, LuView } from "react-icons/lu";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        title: "User Already in group!",
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admins can add someone!",
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toaster.create({
        title: "Only admins can remove someone!",
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toaster.create({        title: "Error Occured!",
        description: error.response.data.message,
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
        <Toaster />
      <IconButton display={{base:"flex"}} 
              onClick={(e)=>setIsOpen(!e.isOpen)}>
                <LuCircleUserRound></LuCircleUserRound>
              </IconButton>
                  <DrawerRoot
                          size="sm"
                          placement="end"
                          open={isOpen}
                          onOpenChange={(e) => setIsOpen(e.open)}
                        >
                          <DrawerBackdrop />
                          <DrawerContent>
                            <DrawerHeader borderBottomWidth="1px">
                              <DrawerTitle>{selectedChat.chatName}</DrawerTitle>
                            </DrawerHeader>
          <DrawerBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <Box display='flex' flexDirection='column'>
            <FormControl display='flex' flexDirection='row' mb={4} alignItems='center'>
              <Input
              p={6}
                placeholder="Chat Name"
                mb={3}
                height={35}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                height={30}
                ml={5}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display='flex' flexDirection='row' mb={8}>
              <Input
                            p={6}
              height={35}
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />

            </FormControl>
            </Box>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
            </DrawerBody>
                      <DrawerFooter display='flex' >
                        <Button mr={2} ml={2} onClick={() => handleRemove(user)} colorScheme="blue">
                          Leave Group
                        </Button>
                                              <DrawerActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DrawerActionTrigger>
                                  <DrawerCloseTrigger asChild>
                                    <Button>Close</Button>
                                  </DrawerCloseTrigger>
                                </DrawerFooter>
                              </DrawerContent>
                            </DrawerRoot>
    </>
  );
};

export default UpdateGroupChatModal;
