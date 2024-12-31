//export default GroupChatModal;
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Button,
  Input,
  Box,
} from "@chakra-ui/react";
 import { useDisclosure } from '@chakra-ui/hooks'
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
import { FormControl } from "@chakra-ui/form-control";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
// import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { Toaster, toaster } from "@/components/ui/toaster"
const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toaster.create({
        title: "User already added",
        type: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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
      //console.log(data);
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
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
                setIsOpen((isOpen)=>(!isOpen));
                setSearchResult([])
    if (!groupChatName || !selectedUsers) {
      toaster.create({
        title: "Please fill all the feilds",
        type: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedUsers.length<=2) {
      toaster.create({
        title: "Atleast 3 members are required for a group",
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setSelectedUsers([]);
      toaster.create({
        title: "New Group Chat Created!",
        type: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toaster.create({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        type: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
        <Toaster />
    <span onClick={(e)=>setIsOpen(!e.isOpen)}>{children}</span>
    <DrawerRoot
            size="sm"
            placement="end"
            open={isOpen}
            onOpenChange={(e) => setIsOpen(e.open)}
          >
            <DrawerBackdrop />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                <DrawerTitle>{children}</DrawerTitle>
              </DrawerHeader>
              <DrawerBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl mb={8}>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  // admin={}
                  handleFunction={() => handleDelete(u)
                  }
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </DrawerBody>
          <DrawerFooter display='flex' >
            <Button mr={2} ml={2} onClick={handleSubmit} colorScheme="blue">
              Create Chat
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

export default GroupChatModal;
