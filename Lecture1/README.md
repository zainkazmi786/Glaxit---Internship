# Node.js User Signup/Login API 

This is a simple user authentication system using ** Node.js**  and the **`fs` module** for data storage. User credentials are stored in a local `users.json` file.

## Features

-  User Signup (`POST /signup`)
-  User Login (`POST /login`)
-  User Delete (`DELETE /user`)
-  Passwords are hashed using `bcryptjs`
-  User data is stored in `users.json`

---


Run the Server
```
node server.js
```
Server will start at:


http://localhost:3000


API Endpoints
# Signup
POST /signup

Body:
```

{
  "username": "zain",
  "password": "1234"
}
```
# Login
POST /login

Body:

```
{
  "username": "zain",
  "password": "1234"
}
```
# Delete User
DELETE /user

Body:

```
{
  "username": "zain"
}
```
Notes

All user data is stored locally in users.json
For demo use only — not production safe (no JWT/session).



---
## Import Modules and Setup Express App

```js
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

```


## Functions to Read/Write File

```js
function readUsers() {
  const data = fs.readFileSync('users.json', 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}
```

We're using built-in fs to read/write to users.json
express.json() parses incoming JSON request bodies.



##  Implement Signup Route (POST /signup)
```js 
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

```


Password is securely hashed before storing.

## Implement Login Route (POST /login)
```js
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
```


Compares the hashed password with the input.

## Implement Delete Route (DELETE /user)
```js
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
```

## Start the Server
```js

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```


##  Success Codes 
| Code  | Meaning    | When to Use                                       |
| ----- | ---------- | ------------------------------------------------- |
| `200` | OK         | Request succeeded, return the result.             |
| `201` | Created    | Resource successfully created (e.g., signup).     |
| `204` | No Content | Success, but no content to return (e.g., delete). |


## Client Error Codes

| Code  | Meaning      | When to Use                                     |
| ----- | ------------ | ----------------------------------------------- |
| `400` | Bad Request  | Missing/invalid data in the request.            |
| `401` | Unauthorized | Authentication required (e.g., login failed).   |
| `403` | Forbidden    | User is authenticated but not allowed.          |
| `404` | Not Found    | Resource doesn't exist.                         |
| `409` | Conflict     | Resource already exists (e.g., duplicate user). |




## FS Fnctions 

| Function                              | Description                                  |
| ------------------------------------- | -------------------------------------------- |
| `fs.readFile(path, callback)`         | Reads a file asynchronously                  |
| `fs.readFileSync(path)`               | Reads a file synchronously                   |
| `fs.writeFile(path, data, callback)`  | Writes data to a file (overwrites if exists) |
| `fs.writeFileSync(path, data)`        | Same as above but synchronously              |
| `fs.appendFile(path, data, callback)` | Appends data to the end of a file            |
| `fs.appendFileSync(path, data)`       | Synchronous version                          |
| `fs.unlink(path, callback)`           | Deletes a file                               |
| `fs.unlinkSync(path)`                 | Synchronous           |
| ---------------------------- | ----------------------------- |
| `fs.mkdir(path, callback)`   | Creates a new directory       |
| `fs.mkdirSync(path)`         | Synchronous version           |
| `fs.rmdir(path, callback)`   | Removes a directory           |
| `fs.rmdirSync(path)`         | Synchronous version           |
| `fs.readdir(path, callback)` | Reads contents of a directory |
| `fs.readdirSync(path)`       | Synchronous version           |



## MiddleWares

In Express.js, a middleware is a function that has access to the request (req), response (res), and the next function (next) in the request-response cycle.

```js
function middleware(req, res, next) {
  // Do something with req or res
  next(); // Pass control to the next middleware/route
}
```


### You can use middlewares to:

- Log requests
- Authenticate users
- Validate data
- Modify request or response objects
- Handle errors


```js
function middleware(req, res, next) {
  // Do something with req or res
  next(); // Pass control to the next middleware/route
}
```


## Example : Logging Middleware

```js
const express = require('express');
const app = express();

// Custom middleware to log each request
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // Move to next handler
}

app.use(logger); // Apply the middleware globally

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
```



Here’s a **bullet summary** of everything we covered in your Node.js beginner session, formatted for a `README.md`:

---

#  Summary

##  Basic Concepts

* **Node.js** is a runtime environment that allows running JavaScript outside the browser.
* It is **single-threaded** and **non-blocking**, making it perfect for I/O-heavy operations.

---

## ⚙️ Server Setup

* A basic server can be created using the `http` module or **Express.js** (preferred for simplicity).
* Express simplifies routing, parsing JSON, and managing APIs.

---

## 📂 File System (FS) Module

* Node.js provides the `fs` module to work with files:

  * `fs.readFile`, `fs.writeFile`, `fs.appendFile`, `fs.unlink`, `fs.existsSync`, etc.
  * Supports both **asynchronous (non-blocking)** and **synchronous (blocking)** versions.

---

## 🔄 Synchronous vs Asynchronous

* **Synchronous** code runs line-by-line, blocking the execution.
* **Asynchronous** code uses callbacks/promises to prevent blocking (e.g., `fs.readFile`).

---


## 📦 Middleware (in Express)

* Middleware functions execute **before the final request handler**.
* Common uses:

  * Parsing `req.body` using `express.json()`
  * Logging requests
  * Validating inputs
  * Handling authentication

---

## 🔐 APIs Implemented

* **Signup API:** Adds a new user to a JSON file.
* **Login API:** Validates credentials from the JSON file.
* **Delete API:** Deletes a user from the file based on username.
* Credentials are stored in `users.json` (no database).

---

## 📄 HTTP Status Codes

* `200 OK`: Success
* `201 Created`: Resource created
* `400 Bad Request`: Missing or invalid input
* `401 Unauthorized`: Wrong credentials
* `404 Not Found`: Resource not found
* `500 Internal Server Error`: Unexpected server crash

---


