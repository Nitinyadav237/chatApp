import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import Loader from "@/components/Loader";
import LeftNav from "@/components/LeftNav";
import Chats from "@/components/Chats";
import Chat from "@/components/Chat";
import { useChatContext } from "@/context/chatContext";

const Home = () => {
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  const { data, chats, setSelectedChat, dispatch } = useChatContext();
  const isChatDeleted = chats[data.chatId]?.chatDeleted;

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    if (isChatDeleted) {
      const filteredChats = Object.entries(chats || {}).filter(
        ([id, chat]) => !chat.chatDeleted
      );
      if (filteredChats.length > 0) {
        const latestChatId = filteredChats[filteredChats.length - 1][0];
        const latestChat = filteredChats[filteredChats.length - 1][1];
        setSelectedChat(latestChat.userInfo);
        dispatch({
          type: "CHANGE_USER",
          payload: latestChat.userInfo,
        });
      } else {
        dispatch({ type: "EMPTY" });
      }
    }
  }, [isChatDeleted]);

  return !currentUser ? (
    <Loader />
  ) : (
    <>
      <div className="bg-c1 flex h-[100vh]">
        <div className="flex w-full shrink-0">
          <LeftNav />
          <div className="flex bg-c2 grow">
            <div className="w-[400px] p-5 overflow-auto scrollbar shrink-0 border-r border-white/[0.05]">
              <div className="flex flex-col h-full">
                <Chats />
              </div>
            </div>
            {!data.chatId || isChatDeleted ? (
              <div className="w-full text-center text-c3 py-5">
                No chat available
              </div>
            ) : (
              <Chat />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
