import React, { useState } from "react";
import PopupWrapper from "./PopupWrapper";
import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Avatar from "../Avatar";
import { db } from "@/firebase/firebase";
import Search from "../Search";

const UsersPopup = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch, data, setSelectedChat } = useChatContext();
  const [hoveredUser, setHoveredUser] = useState(null);

  const handleSelect = async (user) => {
    try {
      const combineId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;

      const res = await getDoc(doc(db, "chats", combineId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combineId), {
          messages: [],
        });

        const currentUserChatRef = await getDoc(
          doc(db, "userChats", currentUser.uid)
        );
        const userChatRef = await getDoc(doc(db, "userChats", user.uid));

        if (!currentUserChatRef.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combineId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL || null,
            color: user.color,
          },
          [combineId + ".date"]: serverTimestamp(),
        });

        if (!userChatRef.exists()) {
          await setDoc(doc(db, "userChats", user.uid), {});
        }

        await updateDoc(doc(db, "userChats", user.uid), {
          [combineId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL || null,
            color: currentUser.color,
          },
          [combineId + ".date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combineId + ".chatDeleted"]: deleteField(),
        });
      }
      dispatch({ type: "CHANGE_USER", payload: user });
      setSelectedChat(user); // Set the selected chat in the context
      props.onHide();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMouseEnter = (user) => {
    setHoveredUser(user);
  };

  const handleMouseLeave = () => {
    setHoveredUser(null);
  };

  const isUserSelected = (user) => {
    return user.uid === data?.user?.uid;
  };

  return (
    <PopupWrapper {...props}>
      <Search />
      <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
        <div className="absolute w-full">
          {users &&
            Object.values(users).map((user) =>
              user.uid === currentUser.uid ? null : (
                <div
                  key={user.uid}
                  className={`flex items-center gap-4 rounded-xl py-2 px-4 cursor-pointer ${
                    isUserSelected(user) ? "bg-c5" : ""
                  }`}
                  onClick={() => handleSelect(user)}
                  onMouseEnter={() => handleMouseEnter(user)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Avatar size="large" user={user} />
                  <div className="flex flex-col gap-1 grow">
                    <span className="text-base text-white flex items-center justify-between">
                      <div className="font-medium ">{user?.displayName}</div>
                    </span>
                    <p className="text-c3 text-sm">{user?.email}</p>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </PopupWrapper>
  );
};

export default UsersPopup;
