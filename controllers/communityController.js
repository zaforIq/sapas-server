import path from 'path';
import { fileURLToPath } from 'url';
import { questionUpload, noteUpload } from '../middlewares/multer.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getNotes = async (req, res) => {
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query('SELECT * FROM notes');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

export const getSingleNote = async (req, res) => {
    const { path: filePath } = req.params;
    const fullPath = path.join(__dirname, '..', 'uploads', 'notes', filePath);

    res.sendFile(fullPath, (err) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }
    });
};

export const createNote = async (req, res) => {


        const pool = req.app.get('pool');
        const conn = await pool.getConnection();

        try {
            const { title } = req.body;
            const { filename, path: filepath } = req.file;
            await conn.query('INSERT INTO notes (title, filename, filepath) VALUES (?, ?, ?)', [title, filename, filepath]);
            res.status(201).json({ message: 'Note added successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        } finally {
            conn.release();
        }
};

export const getQuestions = async (req, res) => {
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query('SELECT * FROM questions');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

export const getSingleQuestion = async (req, res) => {
    const { path: filePath } = req.params;
    const fullPath = path.join(__dirname, '..', 'uploads', 'questions', filePath);

    res.sendFile(fullPath, (err) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }
    });
};

export const createQuestion = async (req, res) => {


        const pool = req.app.get('pool');
        const conn = await pool.getConnection();

        try {
            const { title } = req.body;
            const { filename, path: filepath } = req.file;
            await conn.query('INSERT INTO questions (title, filename, filepath) VALUES (?, ?, ?)', [title, filename, filepath]);
            res.status(201).json({ message: 'Question created' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        } finally {
            conn.release();
        }
};

export const triggerFunction = async (req, res) => {
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query('SELECT 1');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}


export const calculateCourseSummary = async (req, res) => {
    const { courseId } = req.params;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query('CALL calculate_course_summary(?, @totalMarksObtained, @remainingScoreNeeded)', [courseId]);
        const [result] = await conn.query('SELECT @totalMarksObtained AS totalMarksObtained, @remainingScoreNeeded AS remainingScoreNeeded');
        res.status(200).json(result[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};