import jwt from 'jsonwebtoken';

// Middleware function to validate a user using the token and store the student details in req.student
const authorizedStudent = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming the token is sent in the Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
        req.student = decoded; // Store the student details in req.student
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default authorizedStudent;