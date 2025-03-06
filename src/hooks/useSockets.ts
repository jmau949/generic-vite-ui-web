import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
}

/**
 * Custom hook to create and manage a Socket.io connection.
 *
 * @param url - The URL of the Socket.io server.
 * @returns The socket instance and connection status.
 */
const useSocket = (url: string): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketInstance: Socket = io(url, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return { socket, isConnected };
};

export default useSocket;
