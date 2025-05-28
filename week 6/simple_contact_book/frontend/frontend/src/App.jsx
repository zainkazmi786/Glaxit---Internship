import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Plus, Trash2, Users, Search } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

// Contact Card Component
const ContactCard = ({ contact, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      setIsDeleting(true);
      await onDelete(contact._id);
    }
  };

  return (
    <div className={`bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ${isDeleting ? 'opacity-50 scale-95' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{contact.name}</h3>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors duration-200 group"
        >
          <Trash2 className={`w-4 h-4 text-red-300 group-hover:text-red-200 ${isDeleting ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-white/80">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{contact.phone}</span>
        </div>
        <div className="flex items-center space-x-3 text-white/80">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{contact.email}</span>
        </div>
      </div>
    </div>
  );
};

// Add Contact Form Component
const AddContactForm = ({ onAdd, isAdding }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = async () => {
    if (formData.name && formData.phone && formData.email) {
      await onAdd(formData);
      setFormData({ name: '', phone: '', email: '' });
      setIsVisible(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <Plus className={`w-5 h-5 transition-transform duration-300 ${isVisible ? 'rotate-45' : ''}`} />
        <span>{isVisible ? 'Cancel' : 'Add New Contact'}</span>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isVisible ? 'max-h-96 mt-6' : 'max-h-0'}`}>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isAdding}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isAdding ? 'Adding...' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Search Bar Component
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-white/50" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search contacts..."
        className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
      />
    </div>
  );
};

// Main App Component
const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
        setError(null);
      } else {
        throw new Error('Failed to fetch contacts');
      }
    } catch (err) {
      setError('Failed to load contacts. Make sure your backend is running on localhost:5000');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new contact
  const addContact = async (contactData) => {
    setIsAdding(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      if (response.ok) {
        const newContact = await response.json();
        setContacts(prev => [...prev, newContact]);
        setError(null);
      } else {
        throw new Error('Failed to add contact');
      }
    } catch (err) {
      setError('Failed to add contact');
      console.error('Error adding contact:', err);
    } finally {
      setIsAdding(false);
    }
  };

  // Delete contact
  const deleteContact = async (contactId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact._id !== contactId));
        setError(null);
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (err) {
      setError('Failed to delete contact');
      console.error('Error deleting contact:', err);
    }
  };

  // Filter contacts based on search term
  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  // Initial data fetch
  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600/20 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-600/20 to-transparent rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-bounce">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Contact Book
          </h1>
          <p className="text-white/70 text-lg">Manage your contacts with style</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-300/30 rounded-xl text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Add Contact Form */}
        <AddContactForm onAdd={addContact} isAdding={isAdding} />

        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/70 mt-4">Loading contacts...</p>
          </div>
        )}

        {/* Contacts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => (
                <div
                  key={contact._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ContactCard contact={contact} onDelete={deleteContact} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-white/50" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? 'No contacts found' : 'No contacts yet'}
                </h3>
                <p className="text-white/70">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add your first contact to get started'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        {!loading && contacts.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <span className="text-white/80">Total Contacts:</span>
              <span className="text-2xl font-bold text-white">{contacts.length}</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;