
// utils/helpers.js
const User = require('../models/User');
const crypto = require('crypto');
const axios = require('axios');


/**
 * Generate a random invite code for private rooms
 * @returns {string} 8-character invite code
 */
const generateInviteCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

/**
 * Generate DM room ID from two user IDs
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {string} DM room ID
 */
const generateDMRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `dm_${sortedIds[0]}_${sortedIds[1]}`;
};

const getAvatarByUserId = async (userId) => {
  try {
    const user = await User.findById(userId).select('avatar');
    return user?.avatar || '/default-avatar.png';
  } catch (error) {
    console.error(`Error fetching avatar for user ${userId}:`, error);
    return '/default-avatar.png';
  }
};
/**
 * Sends a prompt to the Gemini API and returns the generated text.
 * @param {string} prompt The text prompt to send to the Gemini model.
 * @returns {Promise<string>} A promise that resolves with the generated text, or an error message.
 */
const sendToGemini = async (prompt) => {
  try {
    // Prepare the chat history with the user's prompt
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    // Construct the payload for the Gemini API request
    const payload = { contents: chatHistory };

    // The API key is automatically provided by the Canvas environment if left empty.
    // Do NOT add your API key here directly.
    const apiKey = process.env.GEMINI_API_KEY || '';

    // Define the API URL for the gemini-2.0-flash model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Make the POST request to the Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    // Parse the JSON response
    const result = await response.json();

    // Extract the generated text from the response
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      return text;
    } else {
      // Handle cases where the response structure is unexpected or content is missing
      console.warn('Gemini API response structure unexpected:', result);
      return 'No response or unexpected response structure from Gemini.';
    }
  } catch (err) {
    console.error('Gemini API error:', err);
    return 'Sorry, I had trouble understanding that. Please try again.';
  }
};



module.exports = {
  generateInviteCode,
  generateDMRoomId,
  getAvatarByUserId,
  sendToGemini
};


