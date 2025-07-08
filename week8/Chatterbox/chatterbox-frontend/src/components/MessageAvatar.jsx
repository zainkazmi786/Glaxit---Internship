import React, { useEffect, useState } from 'react';
import api from '../config/api'; // Adjust the import path as necessary

const MessageAvatar = ({ senderId, senderName }) => {
  const [avatar, setAvatar] = useState('/default-avatar.png');
  const fetchSenderAvatar = async (id) => {
    try {
      if(id === '64b0ee2c189286a5abc6b4ba') {
        return '/gemini-icon-seeklogo.svg'; // Placeholder for AI avatar
      }
      const response = await api.get(`/api/avatar/${id}`);
      console.log(response.data.avatar);
      return response.data.avatar || '/default-avatar.png';
    } catch (error) {
      console.error('Failed to fetch avatar:', error);
      return '/default-avatar.png'; // fallback in case of error
    }
  };

  useEffect(() => {
    const getAvatar = async () => {
      const fetched = await fetchSenderAvatar(senderId);
      setAvatar(fetched || '/default-avatar.png');
    };
    getAvatar();
  }, [senderId]);

  return (
    <img
      src={avatar}
      alt={senderName}
      className="w-8 h-8 rounded-full"
    />
  );
};

export default MessageAvatar;