# RBAC Backend API

A comprehensive Role-Based Access Control (RBAC) backend system built with Node.js, Express, and MongoDB.

## Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission system
- **User Management**: Complete user CRUD operations
- **Role Management**: Dynamic role creation and assignment
- **Permission System**: Flexible permission-based access control
- **Security**: Password hashing, rate limiting, CORS, Helmet
- **Validation**: Request validation using Joi
- **MongoDB Integration**: Mongoose ODM with proper relationships

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rbac_system
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB service

5. Seed the database with initial data:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev  # Development mode
npm start    # Production mode
```

## Default Test Accounts

After running the seed script, you can use these accounts:

- **Admin**: admin@example.com / password123
- **Editor**: editor@example.com / password123  
- **User**: user@example.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/assign-role` - Assign role to user
- `POST /api/users/remove-role` - Remove role from user
- `PATCH /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user

### Roles
- `GET /api/roles` - Get all roles (authenticated users)
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create new role (Admin only)
- `PUT /api/roles/:id` - Update role (Admin only)
- `DELETE /api/roles/:id` - Delete role (Admin only)
- `POST /api/roles/:id/assign-permission` - Assign permission to role (Admin only)
- `POST /api/roles/:id/remove-permission` - Remove permission from role (Admin only)

### Permissions
- `GET /api/permissions` - Get all permissions (authenticated users)
- `GET /api/permissions/:id` - Get permission by ID
- `POST /api/permissions` - Create new permission (Admin only)
- `PUT /api/permissions/:id` - Update permission (Admin only)
- `DELETE /api/permissions/:id` - Delete permission (Admin only)

### Posts (Example protected resource)
- `GET /api/posts` - Get all posts (public)
- `GET /api/posts/:id` - Get post by ID (public)
- `POST /api/posts` - Create new post (requires create_post permission)
- `PUT /api/posts/:id` - Update post (requires edit_post permission)
- `DELETE /api/posts/:id` - Delete post (requires delete_post permission)

## Permission System

The system includes these default permissions:

- `create_post` - Create new posts
- `edit_post` - Edit own posts
- `delete_post` - Delete own posts
- `edit_all_posts` - Edit all posts
- `delete_all_posts` - Delete all posts
- `manage_users` - Manage user accounts
- `manage_roles` - Manage roles and assignments
- `manage_permissions` - Manage permissions
- `view_analytics` - View system analytics
- `system_settings` - Modify system settings

## Default Roles

- **Admin**: Full system access (all permissions)
- **Editor**: Content management access (post-related permissions)
- **User**: Basic user access (own post management)

## Authentication

Include JWT token in requests:
```
Authorization: Bearer <your_jwt_token>
```

## Request/Response Format

All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... },
  "error": "Error details (if any)"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token expiration
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Security headers with Helmet
- Input validation with Joi
- Permission-based access control
- User status management (active/inactive)

## Database Schema

### Users
- name, email, password (hashed)
- roles (array of Role IDs)
- isActive (boolean)
- timestamps

### Roles  
- name, description
- permissionIds (array of Permission IDs)
- timestamps

### Permissions
- name, description  
- timestamps

### Posts (Example resource)
- title, content, status
- author (User ID)
- timestamps

## Middleware

- **authMiddleware**: Validates JWT tokens
- **checkPermission**: Validates user permissions
- **checkRole**: Validates user roles

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

### Create a post (with authentication)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"title":"My Post","content":"This is my post content"}'
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Environment (development/production)

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication failures
- Authorization failures
- Database errors
- 404 Not Found
- 500 Server errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

