// import { io, Socket } from "socket.io-client";
// import { BASE_URL } from "./api";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const SOCKET_URL = BASE_URL.replace("/api/v1", "");

// let socket: Socket | null = null;

// export const connectSocket = async (userId: string) => {
//   if (socket?.connected) return socket;

//   socket = io(SOCKET_URL, {
//     transports: ["websocket"],
//   });

//   socket.on("connect", () => {
//     console.log("Socket connected:", socket?.id);
//     socket?.emit("user:join", userId);
//   });

//   return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   socket?.disconnect();
//   socket = null;
// };

import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = async (
  userId: string,
  role: "user" | "driver",
) => {
  const s = getSocket();
  if (!s.connected) s.connect();

  s.on("connect", () => {
    console.log("Socket connected:", s.id);
    if (role === "user") {
      s.emit("user:join", userId);
      console.log("Emitting user:join with:", userId);
    } else {
      s.emit("driver:online", userId);
      console.log("Emitting driver:online with:", userId);
    }
  });

  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
