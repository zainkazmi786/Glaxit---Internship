
// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeSocket, getSocket, disconnectSocket } from '../config/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    if (user) {
      const socketInstance = initializeSocket();
      setSocket(socketInstance);

      if (socketInstance) {
        const handleUserOnline = (data) => {
          setOnlineUsers(prev => new Map(prev.set(data.userId, data.user)));
        };
        const handleOnlineUsersList = (usersArray) => {
          const usersMap = new Map();
          usersArray.forEach(({ user }) => {
            // Use user.id or user._id depending on your data
            const userId = user.id || user._id;
            usersMap.set(userId, user);
          });
          setOnlineUsers(usersMap);
        };

        const handleUserOffline = (data) => {
          setOnlineUsers(prev => {
            const newMap = new Map(prev);
            newMap.delete(data.userId);
            return newMap;
          });
        };

        socketInstance.on('userOnline', handleUserOnline);
        socketInstance.on('onlineUsersList', handleOnlineUsersList);
        socketInstance.on('userOffline', handleUserOffline);

        return () => {
          socketInstance.off('userOnline', handleUserOnline);
          socketInstance.on('onlineUsersList', handleOnlineUsersList);
          socketInstance.off('userOffline', handleUserOffline);
          disconnectSocket();
          setSocket(null);
        };
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
