import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import React from "react";
import PopupWrapper from "./PopupWrapper";
import { RiErrorWarningLine } from "react-icons/ri";
import { DELETED_FOR_ME, DELETED_FOR_EVERYONE } from "@/utills/constants";

const DeleteMsgPopup = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();
  return (
    <PopupWrapper {...props}>
      <div className="mt-10 mb-5">
        <div className="flex items-center justify-center gap-3">
          <RiErrorWarningLine size={24} className="text-red-500" />
          <div className="text-lg">
            Are You Sure, You Want to Delete Message ?
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => props.deleteMessage(DELETED_FOR_ME)}
            className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete For me
          </button>

          {props.self && (
            <button
              onClick={() => props.deleteMessage(DELETED_FOR_EVERYONE)}
              className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
            >
              Delete For Everyone
            </button>
          )}
          <button
            onClick={props.onHide}
            className="border-[2px] border-white py-2 px-4 text-sm rounded-md text-white  hover:bg-white hover:text-black"
          >
            Cancel{" "}
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default DeleteMsgPopup;
