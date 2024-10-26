# Student Performance Analysis System

## Overview
This application is a web-based system that helps students track their performance across different assessments and set target grades. Students can register, add their courses, input their assessment marks, and see how much they need to score in upcoming assessments to achieve their targeted grade. The system differentiates between theory and lab courses and manages assessments accordingly.

## Features
- User registration and login
- Add courses (Theory or Lab)
- Track marks for various assessments (Quizzes, Assignments, Lab Tests, etc.)
- Set target grades and calculate required marks to reach the goal
- Manage assessment records (Create, Update, Delete)

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: MySQL2 for database operations
- **Security**: bcrypt for password hashing
- **Environment Variables**: dotenv for configuration management

## Database Schema
The application uses a MySQL database. Key tables include:
1. **students**: Stores student registration information (studentId, name, email, password, department).
2. **courses**: Contains details of courses (courseId, courseName, courseType, credits, studentId).
3. **assessments**: Lists various assessments by course (assessmentId, assessmentName, courseId).
4. **marks**: Stores marks obtained in assessments (markId, assessmentId, courseId, markObtained, studentId).

For a detailed explanation, please refer to the database schema section in the documentation.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or later)
- [MySQL](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/downloads)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/student-management-system.git
    cd student-management-system
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```
    DB_HOST=your-mysql-host
    DB_USER=your-mysql-username
    DB_PASSWORD=your-mysql-password
    DB_NAME=your-database-name
    PORT=3000
    JWT_SECRET=your-secret-key
    ```

4. **Set up the MySQL database:**
    - Open MySQL Workbench or your preferred MySQL client.
    - Create a new database and run the provided SQL script to create tables.
    - Make sure the database configuration matches the `.env` file settings.

5. **Run the application:**
    ```bash
    npm start
    ```

6. **Access the application:**
    The application will be running on `http://localhost:3001`.

## API Endpoints

### Authentication
- **POST /register** - Register a new student
- **POST /login** - Student login

### Courses
- **POST /courses** - Add a new course
- **GET /courses** - List all courses for a student
- **GET /courses/:courseId** - Get details of a specific course
- **DELETE /courses/:courseId** - Delete a specific course

### Assessments
- **POST /assessments** - Add a new assessment
- **GET /assessments/:courseId** - List assessments for a specific course

### Marks
- **POST /marks** - Add a new mark for an assessment
- **GET /marks/:studentId** - Get all marks of a student
- **GET /marks/:studentId/:courseId** - Get marks of a student for a specific course
- **PUT /marks/:markId** - Update an existing mark
- **DELETE /marks/:markId** - Delete a mark

## Folder Structure
student-management-system/
│
├── controllers/        # Express controllers for handling route logic
│   ├── authController.js       # Handles user authentication (register, login)
│   ├── courseController.js     # Handles course-related operations
│   ├── assessmentController.js # Handles assessment-related operations
│   └── markController.js       # Handles mark-related operations
│
├── models/             # Database models and schema definitions
│   ├── db.js                   # Database connection setup
│   ├── studentModel.js         # Schema for student information
│   ├── courseModel.js          # Schema for course information
│   ├── assessmentModel.js      # Schema for assessment information
│   └── markModel.js            # Schema for storing marks
│
├── routes/             # Application route handlers
│   ├── authRoutes.js           # Routes for authentication
│   ├── courseRoutes.js         # Routes for course operations
│   ├── assessmentRoutes.js     # Routes for assessment operations
│   └── markRoutes.js           # Routes for managing marks
│
├── middleware/         # Custom middleware functions
│   └── authMiddleware.js       # Authentication and authorization checks
│
├── utils/              # Utility functions and helper modules
│   └── calculateMarks.js       # Utility to calculate required marks
│
├── config/             # Configuration files (e.g., database, environment)
│   └── dbConfig.js            # Database connection configuration
│
├── .env                # Environment variables for sensitive data
├── .gitignore          # Files and directories to be ignored by Git
├── package.json        # Dependencies and project metadata
├── app.js              # Main entry point for the Express application
└── README.md           # Project documentation

## Usage
1. Register and log in as a student.
2. Add courses based on your enrolled subjects.
3. Add assessments for each course and input your marks.
4. Set a target score/grade for each course.
5. Monitor progress and see required marks to achieve the target grade.

## Contributing
Feel free to fork the repository and submit pull requests. Please ensure that the code follows the style guidelines and includes necessary tests.

## License
This project is licensed under the MIT License.
