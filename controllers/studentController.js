import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const signUp = async (req, res) => {
    const { studentId, name, department, email, password } = req.body;
    console.log(req.body);
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {

     
        const passwordHash = await bcrypt.hash(password, 10);
        await conn.query('INSERT INTO students(studentId, name, department, email, password) VALUES(?,?,?,?,?)', [studentId, name, department, email, passwordHash]);
        const token = jwt.sign({ studentId: studentId, name:name, department:department, email: email }, process.env.JWT_SECRET, { expiresIn : '10h' });
        res.status(201).json({ 
            student: { studentId, name, department, email },
            token,
            message: 'Sign up successful' 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

export const logIn = async (req, res) => {
    const { email, password } = req.body;
    
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM students WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const student = rows[0];
        const passwordMatch = await bcrypt.compare(password, student.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ studentId: student.studentId, name: student.name, department: student.department, email: student.email }, process.env.JWT_SECRET, { expiresIn : '1h' });
        res.status(200).json({ 
            student: _.omit(student, 'password'),
            token,
            message: 'Login successful' 
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
    // Implementation for login
};


export const getStudentDetails = async (req, res) => {
    const studentId = req.student.studentId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM students WHERE studentId = ?', [studentId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

export const updateStudentDetails = async (req, res) => {
    const studentId = req.student.studentId;
    const { name, department, email } = req.body;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        await conn.query('UPDATE students SET name = ?, department = ?, email = ? WHERE studentId = ?', [name, department, email, studentId]);
        res.status(200).json({ message: 'Student details updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

export const deleteStudent = async (req, res) => {
    const studentId = req.student.studentId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        await conn.query('DELETE FROM students WHERE studentId = ?', [studentId]);
        res.status(200).json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}