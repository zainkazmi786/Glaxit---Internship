const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Move to next handler
}

// Middleware to parse JSON body
app.use(express.json());
app.use(logger); 

function readUsers() {
  const data = fs.readFileSync('users.json', 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}


app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  // Check if user exists
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), username, password: hashed });
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  res.json({ message: 'Login successful' });
});


app.delete('/user', (req, res) => {
  const { username } = req.body;
  let users = readUsers();

  const initialLength = users.length;
  users = users.filter(u => u.username !== username);

  if (users.length === initialLength) {
    return res.status(404).json({ message: 'User not found' });
  }

  writeUsers(users);
  res.json({ message: 'User deleted successfully' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});