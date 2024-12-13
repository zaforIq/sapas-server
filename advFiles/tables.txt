CREATE TABLE students (
    studentId VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    department VARCHAR(100)
);

CREATE TABLE courses (
    courseId INT PRIMARY KEY AUTO_INCREMENT,
    studentId VARCHAR(20),
    courseName VARCHAR(100) NOT NULL,
    courseType ENUM('Theory', 'Lab') NOT NULL,
    credits DECIMAL(3,1) NOT NULL,
    targetScore DECIMAL(5,2),
    FOREIGN KEY (studentId) REFERENCES students(studentId) ON DELETE CASCADE
);

CREATE TABLE assessments (
    assessmentId INT PRIMARY KEY AUTO_INCREMENT,
    courseId INT,
    assessmentName VARCHAR(50) NOT NULL,
    highestMark DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE
);

CREATE TABLE marks (
    markId INT PRIMARY KEY AUTO_INCREMENT,
    assessmentId INT,
    courseId INT,
    markObtained DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (assessmentId) REFERENCES assessments(assessmentId) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(courseId) ON DELETE CASCADE
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

