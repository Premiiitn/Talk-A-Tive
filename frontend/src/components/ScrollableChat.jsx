/* eslint-disable react/prop-types */
import { Avatar } from "@/components/ui/avatar"
import { Tooltip } from "@/components/ui/tooltip";
 import ProfileModal from "./miscellaneous/ProfileModal";

import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../Config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed >
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex"}} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (

                <ProfileModal user={m.sender}>
                  <Tooltip ids={{ trigger: m.sender.name }}content={m.sender.name} positioning={{ offset: { mainAxis: 4, crossAxis: 4 } }} >
                  <Avatar
                  ids={{root:m.sender.name}}
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                    </Tooltip>
                </ProfileModal>


            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#46b7af" : "black"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
