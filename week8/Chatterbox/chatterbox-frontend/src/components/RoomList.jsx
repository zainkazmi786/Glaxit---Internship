// src/components/RoomList.js
import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import RoomManageDialog from './RoomManageDialog';

import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const RoomList = ({ onRoomSelect, currentRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'dms'
  const [dmRooms, setDmRooms] = useState([]);
  const { socket, onlineUsers } = useSocket();
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [selectedRoomForDialog, setSelectedRoomForDialog] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchRooms();
    fetchUsers();
    fetchDMRooms();
  }, []);


  const handleRoomInfo = (room, e) => {
    e.stopPropagation(); // Prevent room selection
    setSelectedRoomForDialog(room);
    setShowRoomDialog(true);
  };
  const handleRoomUpdate = () => {
    fetchRooms();
    fetchDMRooms();
  };


  const fetchRooms = async () => {
    try {
      const [publicRooms, myRooms] = await Promise.all([
        api.get('/api/rooms/public'),
        api.get('/api/rooms/my-rooms')
      ]);

      // Filter out DM rooms from regular rooms
      const regularRooms = myRooms.data.filter(room => !room.isDM);
      publicRooms.data.forEach(room => {
        if (!room.isDM && !regularRooms.find(r => r._id === room._id)) {
          regularRooms.push(room);
        }
      });

      setRooms(regularRooms);
      console.log('Fetched rooms:', regularRooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  };

  const fetchDMRooms = async () => {
    try {
      const response = await api.get('/api/rooms/my-rooms');
      const dms = response.data.filter(room => room.isDM);
      setDmRooms(dms);
      console.log('Fetched DM rooms:', dms);
    } catch (error) {
      console.error('Failed to fetch DM rooms:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.filter(u => u._id !== user?.id));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const response = await api.post('/api/rooms/create', {
        name: newRoomName,
        isPrivate
      });

      setNewRoomName('');
      setIsPrivate(false);
      setShowCreateForm(false);

      // Show invite code for private rooms
      if (response.data.inviteCode) {
        alert(`Room created! Invite code: ${response.data.inviteCode}\nShare this code with others to join your private room.`);
      }

      fetchRooms();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const joinPrivateRoom = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    try {
      setJoinError('');
      await api.post(`/api/rooms/join/${inviteCode.trim()}`);

      setInviteCode('');
      setShowJoinForm(false);
      fetchRooms();
      alert('Successfully joined the private room!');
    } catch (error) {
      setJoinError(error.response?.data?.message || 'Failed to join room');
    }
  };
  const handleDeleteRoom = async (roomId) => {
    const confirmed = window.confirm("Are you sure you want to delete this room?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/rooms/${roomId}`);
      alert("Room deleted successfully ✅");

      // Option 1: Remove room from state
      setRooms(prev => prev.filter(room => room._id !== roomId));

      // Option 2: Re-fetch rooms
      // await fetchRooms();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete room ❌");
    }
  };
  const joinPublicRoom = async (room_id) => {


    try {
      setJoinError('');
      await api.post(`/api/rooms/join-public/${room_id}`);
      alert('✅ Successfully joined the public room!');
    } catch (error) {
      setJoinError(error.response?.data?.message || '❌ Failed to join room');
    }
  };

  const createDM = async (targetUserId) => {
    try {
      const response = await api.post(`/api/rooms/dm/${targetUserId}`);
      const dmRoom = response.data;

      // Convert to expected format for onRoomSelect
      const roomData = {
        id: dmRoom._id,
        name: getDMDisplayName(dmRoom),
        type: 'dm',
        ...dmRoom
      };

      fetchDMRooms();
      onRoomSelect(roomData);
      setShowUsersList(false);
    } catch (error) {
      console.error('Failed to create DM:', error);
      alert('Failed to create direct message');
    }
  };

  const getDMDisplayName = (dmRoom) => {
    if (!dmRoom.members) return 'Direct Message';

    const otherUser = dmRoom.members.find(member => member._id !== user?.id);
    console.log('Other user in DM:', otherUser);
    return otherUser ? otherUser.name : 'Direct Message';
  };

  const copyInviteCode = (room) => {
    if (room.inviteCode) {
      navigator.clipboard.writeText(room.inviteCode);
      alert('Invite code copied to clipboard!');
    }
  };

  const formatRoomForSelection = (room) => ({
    id: room._id,
    name: room.name,
    type: room.isDM ? 'dm' : 'room',
    ...room
  });

return (
    <div className="w-[440px]  bg-gradient-to-b from-white to-slate-300 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-xl border-r border-slate-800/30 dark:border-slate-700/30 h-full flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/40 dark:border-slate-700/40 bg-gradient-to-r from-white/95 to-slate-50/95 dark:from-slate-800/95 dark:to-slate-900/95">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`group flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'rooms'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105 shadow-blue-500/25'
              : 'bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 hover:scale-105 hover:shadow-md'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Rooms
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dms')}
            className={`group flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'dms'
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105 shadow-blue-500/25'
              : 'bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 hover:scale-105 hover:shadow-md'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              DMs
            </div>
          </button>
        </div>

        {activeTab === 'rooms' ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="group w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Room
              </div>
            </button>
            <button
              onClick={() => setShowJoinForm(!showJoinForm)}
              className="group w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-green-500/30 transform"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.743-7.743z" />
                </svg>
                Join Private Room
              </div>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowUsersList(!showUsersList)}
            className="group w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New DM
            </div>
          </button>
        )}
      </div>

      {/* Create Room Form */}
      {showCreateForm && activeTab === 'rooms' && (
        <div className="p-4 border-b border-slate-200/40 dark:border-slate-700/40 bg-gradient-to-r from-slate-50/90 to-slate-100/90 dark:from-slate-700/90 dark:to-slate-800/90 animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={createRoom} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full p-3 bg-white/90 dark:bg-slate-600/90 border border-slate-200/50 dark:border-slate-500/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 hover:shadow-md hover:bg-white dark:hover:bg-slate-600 placeholder-slate-400 dark:placeholder-slate-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            <label className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-600/60 rounded-xl cursor-pointer hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 hover:scale-105 hover:shadow-sm group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                />
                <div className="absolute inset-0 rounded bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200">Private Room</span>
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-auto transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-green-500/25 transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create
                </div>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-slate-500/25 transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </div>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Join Private Room Form */}
      {showJoinForm && activeTab === 'rooms' && (
        <div className="p-4 border-b border-slate-200/40 dark:border-slate-700/40 bg-gradient-to-r from-slate-50/90 to-slate-100/90 dark:from-slate-700/90 dark:to-slate-800/90 animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={joinPrivateRoom} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter invite code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full p-3 bg-white/90 dark:bg-slate-600/90 border border-slate-200/50 dark:border-slate-500/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 hover:shadow-md hover:bg-white dark:hover:bg-slate-600 placeholder-slate-400 dark:placeholder-slate-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            {joinError && (
              <div className="p-3 bg-red-50/90 dark:bg-red-900/20 border border-red-200/50 dark:border-red-700/50 rounded-xl animate-in slide-in-from-top-1 duration-200">
                <p className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {joinError}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-green-500/25 transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Join
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowJoinForm(false);
                  setJoinError('');
                  setInviteCode('');
                }}
                className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg hover:shadow-slate-500/25 transform"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </div>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List for DM */}
      {showUsersList && activeTab === 'dms' && (
        <div className="p-4 border-b border-slate-200/40 dark:border-slate-700/40 bg-gradient-to-r from-slate-50/90 to-slate-100/90 dark:from-slate-700/90 dark:to-slate-800/90 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-300">
          <h4 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Select user to message:
          </h4>
          <div className="space-y-2">
            {users.map(u => (
              <div
                key={u._id}
                onClick={() => createDM(u._id)}
                className="group flex items-center gap-3 p-3 hover:bg-white/70 dark:hover:bg-slate-600/70 cursor-pointer rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md border border-transparent hover:border-slate-200/50 dark:hover:border-slate-500/50"
              >
                <div className="relative">
                  <img
                    src={u.avatar || '/default-avatar.png'}
                    alt={u.name}
                    className="w-8 h-8 rounded-full ring-2 ring-slate-200/50 dark:ring-slate-600/50 group-hover:ring-blue-500/50 transition-all duration-300"
                  />
                  {onlineUsers.has(u._id) && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200">{u.name}</span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {onlineUsers.has(u._id) ? 'Online' : 'Offline'}
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors duration-200 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowUsersList(false)}
            className="w-full mt-3 bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      )}

      {/* Room/DM List */}
      <div className="flex-1  overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {activeTab === 'rooms' ? (
          /* Regular Rooms */
          <div className="p-2 px-6 space-y-2">
            {rooms.map(room => (
              <div
                key={room._id}
                className={`group relative p-4  rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent ${currentRoom?.id === room._id
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg shadow-blue-500/10'
                  : 'hover:bg-white/70 dark:hover:bg-slate-700/70 hover:border-slate-200/30 dark:hover:border-slate-600/30'
                  }`}
              >
                {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                <div
                  onClick={() => {
                    console.log(room.members, user);
                    if (room.members.some(member => member._id.toString() === user.id)) {
                      onRoomSelect(formatRoomForSelection(room));
                    }
                  }}
                  className="relative z-10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        {room.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-200">{room.name}</span>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          {room.members?.length || 0} members
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* Info button */}
                      <button
                        onClick={(e) => handleRoomInfo(room, e)}
                        className="text-xs bg-slate-100/80 dark:bg-slate-600/80 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-500/80 transition-all duration-200 hover:scale-110 shadow-sm"
                        title="Room Info"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      {room.isPrivate && (
                        <span className="text-xs bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-lg font-medium shadow-sm">
                          Private
                        </span>
                      )}
                      {!room.isPrivate &&
                        !room.members.some(member => member._id.toString() === user.id) && (
                          <button
                            onClick={async () => {
                              const confirmed = window.confirm('Do you want to join this public room?');
                              if (confirmed) {
                                await joinPublicRoom(room._id);
                                await fetchRooms();
                              }
                            }}
                            className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg font-medium"
                          >
                            Join
                          </button>
                        )}
                      {room.creator._id === user.id || room.admins?.some(admin => admin._id === user.id) ? (
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="text-xs bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg font-medium"
                        >
                          Delete
                        </button>
                      ) : null}
                      {room.inviteCode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyInviteCode(room);
                          }}
                          className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-lg hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50 transition-all duration-200 hover:scale-110 shadow-sm font-medium"
                          title="Copy invite code"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          /* DM Rooms */
          <div className="p-2 px-6 space-y-2">
            {dmRooms.map(room => {
              const otherUser = room.members?.find(member => member._id !== user?.id);
              const isOnline = otherUser && onlineUsers.has(otherUser._id);

              return (
                <div
                  key={room._id}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent ${currentRoom?.id === room._id
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 shadow-lg shadow-blue-500/10'
                    : 'hover:bg-white/70 dark:hover:bg-slate-700/70 hover:border-slate-200/30 dark:hover:border-slate-600/30'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div
                      onClick={() => onRoomSelect(formatRoomForSelection(room))}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className="relative">
                        <img
                          src={otherUser?.avatar || '/default-avatar.png'}
                          alt={otherUser?.name || 'User'}
                          className="w-10 h-10 rounded-full ring-2 ring-slate-200/50 dark:ring-slate-600/50 group-hover:ring-blue-500/50 transition-all duration-300 shadow-md"
                        />
                        {isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-sm text-slate-800 dark:text-slate-100">
                          {otherUser?.name || 'Unknown User'}
                        </span>
                        <div className="text-xs text-gray-500">
                          {isOnline ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </div>

                    {/* Info button for DMs */}
                    <button
                      onClick={(e) => handleRoomInfo(room, e)}
                      className="text-xs bg-slate-100/80 dark:bg-slate-600/80 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-500/80 transition-all duration-200 hover:scale-110 shadow-sm"
                      title="Room Info"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
      <RoomManageDialog
        room={selectedRoomForDialog}
        isOpen={showRoomDialog}
        onlineusers={onlineUsers}
        onClose={() => {
          setShowRoomDialog(false);
          setSelectedRoomForDialog(null);
        }}
        onRoomUpdate={handleRoomUpdate}
      />
    </div>
      );
};

export default RoomList;