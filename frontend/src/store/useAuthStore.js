import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import { useChatStore } from "./useChatStore.js"; 
//import axios from "axios";


const BASE_URL = "https://chat-app-backend-ia1r.onrender.com";

// zustend initialize
// empty veriable created after use get set method for operation
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      // set user data coming fron backend
      set({ authUser: res.data });
      //connect socket
      get().connectSocket()
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      // set user data coming fron backend
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      // set user data coming fron backend
      set({ authUser: res.data });
      toast.success("Logged in successfully");
get().connectSocket()
      
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      // set user data coming fron backend
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

// connect socket from backend

  connectSocket: async ()=>{
    //get authUser from ZOD set user user data
    const {authUser} = get();
    // when is typing showing typing to the second user
    const isTyping = useChatStore.getState().isTyping;
      // socket is connected then return
    if(!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL,{
      query:{
        // set userId coming from authUser which is corrent login user id
        userId:authUser._id,
        isTyping:isTyping
      }
    });
    // connect socket method
    socket.connect();
    // socket is equal to socket
    set({socket:socket});
    // established connection between users to share data
    socket.on("getOnlineUsers" , (userIds)=>{
      // set userIds in onlineUser
      set({onlineUsers:userIds})
    })
  },
  // disconnected socket
  disconnectSocket:()=>{
    if(get().socket?.connected) get().socket.disconnect(); // events connects and disconnect
  }

}));
