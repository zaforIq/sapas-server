

export const createMark = async (req, res) => {
   const studentId = req.student.studentId;
   const courseId = req.headers.courseid;
    const assesmentId = req.headers.assesmentid;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const { markObtained } = req.body;
        await conn.query('INSERT INTO marks (studentId, courseId, assesmentId, markObtained) VALUES (?, ?, ?, ?)', [studentId, courseId, assesmentId, markObtained]);
        res.status(201).json({ message: 'Mark added successfully' });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

export const getMarks = async (req, res) => {
    const studentId = req.student.studentId;
    const courseId = req.headers.courseid;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM marks WHERE studentId = ? AND courseId = ?', [studentId, courseId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

export const getMarkById = async (req, res) => {
    const studentId = req.student.studentId;
    const courseId = req.headers.courseid;
    const assesmentId = req.headers.assesmentid;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM marks WHERE studentId = ? AND courseId = ? AND assesmentId = ?', [studentId, courseId, assesmentId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

export const updateMarkById = async (req, res) => {
    const studentId = req.student.studentId;
    const courseId = req.headers.courseid;
    const assesmentId = req.headers.assesmentid;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const { markObtained } = req.body;
        await conn.query('UPDATE marks SET markObtained = ? WHERE studentId = ? AND courseId = ? AND assesmentId = ?', [markObtained, studentId, courseId, assesmentId]);
        res.status(200).json({ message: 'Mark updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

export const deleteMarkById = async (req, res) => {
    const studentId = req.student.studentId;
    const courseId = req.headers.courseid;
    const assesmentId = req.headers.assesmentid;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        await conn.query('DELETE FROM marks WHERE studentId = ? AND courseId = ? AND assesmentId = ?', [studentId, courseId, assesmentId]);
        res.status(200).json({ message: 'Mark deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}
