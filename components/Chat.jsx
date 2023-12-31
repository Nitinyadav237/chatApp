import React from 'react'
import ChatHeader from './ChatHeader'
import Messages from './Messages'
import { useChatContext } from '@/context/chatContext'
import ChatFooter from './ChatFooter'
import { useAuth } from '@/context/authContext'

const Chat = () => {
  const { currentUser } = useAuth();
  const { data, users, chats } = useChatContext();

  const isUserBlocked = users[currentUser?.uid]?.blockedUsers?.find((u) => u === data?.user?.uid);
  const IamBlocked = users[data?.user?.uid]?.blockedUsers?.find((u) => u === currentUser?.uid);

  // Check if there is no active chat or every chat is deleted
  const noActiveChat = !data?.chatId || !chats[data?.chatId] || chats[data?.chatId]?.chatDeleted;

  return (
    <div className='flex flex-col p-5 grow'>
      {!noActiveChat && <ChatHeader />}
      {noActiveChat ? (
        <div className="w-full text-center text-c3 py-5">
          No active chat available
        </div>
      ) : (
        <>
          <Messages />
          {!isUserBlocked && !IamBlocked && <ChatFooter />}
          {isUserBlocked && (
            <div className="w-full text-center text-c3 py-5">
              This user has been blocked
            </div>
          )}
          {IamBlocked && (
            <div className="w-full text-center text-c3 py-5">
              {`${data.user.displayName} has blocked you`}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Chat;