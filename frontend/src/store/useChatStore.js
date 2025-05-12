import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

// ZOD created
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  isTyping:false,
 
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {                         // pass user id to in url to get params by backend
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // subscribeTomessage if user avalable then message
  subscribeToMessage: () => {
    // get selected user
    const { selectedUser } = get();
    // if not then return socket
    if (!selectedUser) return;
    // get data from useAuthStore
    const socket = useAuthStore.getState().socket;
      // give newMessage or established connection
    socket.on("newMessage" , (newMessage)=>{
            // message send to selected user by matching senderId and selectedUser Id
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      // if message send
      if(!isMessageSentFromSelectedUser) return;
      // get all previous message with newMessage
      set({
        messages:[...get().messages , newMessage]
      })
    })
  },


  // if user exit then off socket connection
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    // socket off or disconnect
    socket.off("newMessage");
    socket.off("typing"); // Add this line
  },
  // using when user typing it is showing typing to receiver
  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setTyping:(isTyping)=>set({isTyping})

}));