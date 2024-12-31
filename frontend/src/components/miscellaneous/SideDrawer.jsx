/* eslint-disable no-unused-vars */
import { Button} from "@/components/ui/button"
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box ,Text,IconButton,Image} from "@chakra-ui/react"

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu"
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
import { Tooltip } from "@/components/ui/tooltip"
// import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState ,useMemo} from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "./ChatLoading";
import { Spinner } from "@chakra-ui/react";
// import ProfileModal from "./ProfileModal";
// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
// import { getSender } from "../../config/ChatLogics";
 import UserListItem from "../UserAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { LuBell, LuView } from "react-icons/lu"
import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import ProfileModal from "./ProfileModal"
import { getSender } from "@/Config/ChatLogics";
import * as React from 'react';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { VStack } from "@chakra-ui/layout";
import { Toaster,toaster } from "@/components/ui/toaster"
/* eslint-disable no-unused-vars */



/* eslint-disable no-unused-vars */
const SideDrawer = () => {
  // State variables
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Context variables
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  // Logout handler
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  // Search users
  const handleSearch = async () => {
    if (!search.trim()) {
      toaster.create({
        title: "Please enter something in search",
        type: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
            toaster.create({
                title: `Error Occurred!`,
                description:'Failed to load the search results',
                type: 'error',
                duration:2000,
                        isClosable: true,
                position: "bottom-left"
              })
    }
  };

  // Access or create a chat
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      const existingChat = chats.find((c) => c._id === data._id);
      if (!existingChat) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      setLoadingChat(false);
                  toaster.create({
                title: `Error fetching the chat`,
                description: error.response?.data?.message || error.message,
                type: 'error',
                duration:2000,
                        isClosable: true,
                position: "bottom-left",
              })
    }
  };

  // Group notifications by sender or group chat
  const uniqueNotifications = useMemo(() => {
    const unique = new Map(); // key: sender id or chat id, value: notif
    notification.forEach((notif) => {
      let key;
      let displayText = "New Message";

      if (notif.chat.isGroupChat) {
        // Group chat: use chat id as key
        key = notif.chat._id;
        displayText = `New Message in ${notif.chat.chatName}`;
      } else {
        // Private chat: use sender id as key
        if (notif.sender && notif.sender._id) {
          key = notif.sender._id;
          displayText = `New Message from ${notif.sender.name}`;
        } else {
          // Fallback if sender information is missing
          const sender = getSender(user, notif.chat.users);
          if (sender && sender._id) {
            key = sender._id;
            displayText = `New Message from ${sender.name}`;
          }
        }
      }

      if (key && !unique.has(key)) {
        unique.set(key, { ...notif, displayText });
      }
    });
    return Array.from(unique.values());
  }, [notification, user]);

  // Determine badge visibility
  const isBadgeVisible = uniqueNotifications.length > 0;

  // Handle clicking on a notification
  const handleNotificationClick = (notif) => {
    setSelectedChat(notif.chat);
    // Remove all notifications from this sender or group
    setNotification(notification.filter((n) => {
      if (n.chat.isGroupChat && n.chat._id === notif.chat._id) {
        // Remove all notifications from this group chat
        return false;
      } else if (!n.chat.isGroupChat) {
        const senderId = n.sender ? n.sender._id : getSender(user, n.chat.users)?._id;
        const notifSenderId = notif.sender ? notif.sender._id : getSender(user, notif.chat.users)?._id;
        if (senderId && notifSenderId && senderId === notifSenderId) {
          // Remove all notifications from this sender
          return false;
        }
      }
      return true;
    }));
  };

  return (
    <>
        <Toaster />
      {/* Top Bar */}
      <Box
        fontFamily="Fira Sans"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        //bg="whiteAlpha.200"
        p="5px 10px"
        borderWidth="0px"
      >
        {/* Search Button */}
        <Tooltip showArrow content="Search Users to chat">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        {/* App Title */}
        <Box display='flex' flexDirection='row' alignItems='center'>        
          <Text fontFamily="Fira Sans" fontSize="2xl">
          Talk-A-Tive
        </Text>
                <Image
                src="images/talk-a-TIVE.png"
                boxSize="50px"
                borderRadius="full"
                fit="cover"
                alt="Logo"
              />
              </Box>


        {/* Notification and Profile Menus */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Notification Menu */}
          <MenuRoot >
            <MenuTrigger asChild>
              <div>
              <IconButton aria-label="Notifications">
                <Stack spacing={2} direction="row">
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!isBadgeVisible}
                    overlap="circular"
                  >
                    <LuBell size={24} />
                  </Badge>
                </Stack>
              </IconButton>
              </div>
            </MenuTrigger>
            <MenuContent>
              {uniqueNotifications.length === 0 ? (
                <Text p={2}>No New Messages</Text>
              ) : (
                <VStack
                  p={2}
                  align="stretch"
                  spacing={1}
                  minWidth="250px"
                >
                  {uniqueNotifications.map((notif) => (
                    <MenuItem
                     // _focus={{ background: "transparent" }}
                     key={notif._id}
                      value={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      //_hover={{ bg: "gray.100" }} // Customize hover background if needed
                      borderRadius="md"
                      cursor="pointer"
                    >
                      {notif.displayText}
                    </MenuItem>
                  ))}
                </VStack>
              )}
            </MenuContent>
          </MenuRoot>


          {/* User Profile Menu */}
          <MenuRoot>
      <MenuTrigger asChild>
          <div> <Avatar size="sm" name={user.name} src={user.pic}/></div>
      </MenuTrigger>
      <MenuContent >
        <ProfileModal user={user} ><MenuItem value="profile">My Profile</MenuItem></ProfileModal>
        <MenuItem value="logout" onClick={logoutHandler}>Logout</MenuItem>
      </MenuContent>
    </MenuRoot>
        </div>
      </Box>

      {/* Search Users Drawer */}
      <DrawerRoot
        size="sm"
        placement="left"
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <DrawerTitle>Search Users</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            {/* Search Input */}
            <Box display="flex" pb={4}>
              <Input
              p={6}
                placeholder="Search by name or email"
                mr={4}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {/* Search Results */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {/* Loading Spinner for Chat Access */}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
          <DrawerFooter>
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

export default SideDrawer;



