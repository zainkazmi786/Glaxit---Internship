import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';
import { useSocket } from '../context/SocketContext';

const RoomManageDialog = ({ room, isOpen, onClose, onRoomUpdate }) => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    if (isOpen && room) {
      fetchRoomDetails();
    }
  }, [isOpen, room]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/api/rooms/${room._id}`);
      setRoomDetails(response.data);
    } catch (error) {
      setError('Failed to fetch room details');
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  const kickMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to kick this member?')) return;

    try {
      setLoading(true);
      await api.delete(`/api/rooms/${room._id}/members/${memberId}`);
      await fetchRoomDetails();
      onRoomUpdate && onRoomUpdate();
      alert('Member kicked successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to kick member');
    } finally {
      setLoading(false);
    }
  };

  const promoteMember = async (memberId) => {
    try {
      setLoading(true);
      await api.post(`/api/rooms/${room._id}/members/${memberId}/promote`);
      await fetchRoomDetails();
      onRoomUpdate && onRoomUpdate();
      alert('Member promoted to admin successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to promote member');
    } finally {
      setLoading(false);
    }
  };

  const demoteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove admin privileges?')) return;

    try {
      setLoading(true);
      await api.post(`/api/rooms/${room._id}/members/${memberId}/demote`);
      await fetchRoomDetails();
      onRoomUpdate && onRoomUpdate();
      alert('Admin privileges removed successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to demote member');
    } finally {
      setLoading(false);
    }
  };

  const isCurrentUserAdmin = () => {
    return roomDetails?.admins?.some(admin => admin._id === user?.id);
  };

  const isCreator = (memberId) => {
    return roomDetails?.creator?._id === memberId;
  };

  const isAdmin = (memberId) => {
    return roomDetails?.admins?.some(admin => admin._id === memberId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-lg dark:shadow-black/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate max-w-[70%]"
            title={roomDetails?.name}
          >
            {roomDetails?.isDM ? 'Direct Message' : roomDetails?.name || 'Room Members'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl font-bold"
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        {/* Room Info */}
        {roomDetails && (
          <div className="mb-4 p-3 bg-gray-100 dark:bg-slate-700 rounded">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={roomDetails.name}>
              {roomDetails.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {roomDetails.members?.length || 0} members
              {roomDetails.isPrivate && ' • Private'}
              {roomDetails.isDM && ' • Direct Message'}
            </p>
            {roomDetails.inviteCode && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 select-all">
                Invite Code: {roomDetails.inviteCode}
              </p>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm mb-4 p-2 bg-red-50 dark:bg-red-900 rounded">
            {error}
          </div>
        )}

        {/* Members List */}
        {roomDetails && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Members:</h4>
            {roomDetails.members?.map(member => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-3 relative">
                  <img
                    src={member.avatar || '/default-avatar.png'}
                    alt={member.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {onlineUsers.has(member._id.toString()) && (
                    <div className="absolute bottom-0 left-6 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  )}
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate max-w-[12rem]" title={member.name}>
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isCreator(member._id) && <span className="text-purple-600 font-medium dark:text-purple-400">Creator</span>}
                      {!isCreator(member._id) && isAdmin(member._id) && <span className="text-blue-600 font-medium dark:text-blue-400">Admin</span>}
                      {!isCreator(member._id) && !isAdmin(member._id) && <span>Member</span>}
                    </div>
                  </div>
                </div>

                {/* Actions for admins */}
                {isCurrentUserAdmin() && !roomDetails.isDM && member._id !== user?.id && !isCreator(member._id) && (
                  <div className="flex gap-1">
                    {!isAdmin(member._id) ? (
                      <button
                        onClick={() => promoteMember(member._id)}
                        disabled={loading}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                        title="Promote to Admin"
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => demoteMember(member._id)}
                        disabled={loading}
                        className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50"
                        title="Remove Admin"
                      >
                        Demote
                      </button>
                    )}
                    <button
                      onClick={() => kickMember(member._id)}
                      disabled={loading}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                      title="Kick Member"
                    >
                      Kick
                    </button>
                  </div>
                )}

                {/* Show yourself indicator */}
                {member._id === user?.id && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 italic">You</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomManageDialog;
