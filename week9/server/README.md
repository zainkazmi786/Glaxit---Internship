
// README.md
# LearnIt Backend

A comprehensive backend for an online learning platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Admin, Instructor, and Student roles
- **Course Management**: Create, update, approve, and manage courses
- **Lesson Management**: Add lessons with video content and quizzes
- **Enrollment System**: Students can enroll in approved courses
- **Security**: Password hashing with bcrypt, JWT tokens, input validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the server:
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Instructor)
- `PATCH /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `PATCH /api/courses/:id/approve` - Approve course (Admin)
- `POST /api/courses/:id/enroll` - Enroll in course (Student)
- `GET /api/courses/enrolled/my` - Get enrolled courses (Student)
- `GET /api/courses/instructor/my` - Get instructor's courses

### Lessons
- `GET /api/lessons/course/:courseId` - Get course lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create lesson (Instructor)
- `PATCH /api/lessons/:id` - Update lesson (Instructor)
- `DELETE /api/lessons/:id` - Delete lesson (Instructor)

## Role-Based Access Control

- **Admin**: Full access to all features
- **Instructor**: Can create and manage their own courses and lessons
- **Student**: Can browse, enroll in courses, and access enrolled content

## Environment Variables

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learnit
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Deployment

### Using Render

1. Create a new web service on Render
2. Connect your GitHub repository
3. Set environment variables in Render dashboard
4. Deploy using the provided `render.yaml` configuration

### Using Railway/Heroku

1. Install the CLI tool
2. Create a new app
3. Set environment variables
4. Deploy using Git push

## Database Schema

### User Model
- name, email, password, role, purchasedCourses, createdAt

### Course Model
- title, description, price, category, thumbnailUrl, instructor, lessons, approved, enrolledStudents, createdAt

### Lesson Model
- title, videoUrl, content, duration, quiz, course, createdAt

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation and sanitization
- CORS configuration
- Error handling middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.