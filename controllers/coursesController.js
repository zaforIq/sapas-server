


export const setCourse = async (req, res) => {
    const studentId = req.student.studentId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const { courseName, courseType,credits, targetScore } = req.body;
        await conn.query('INSERT INTO courses (courseName, courseType, credits, targetScore, studentId) VALUES (?, ?, ?, ?, ?)', [courseName, courseType, credits, targetScore, studentId]);
        res.status(201).json({ message: 'Course added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }

}

export const getCourses = async (req, res) => {
    const studentId = req.student.studentId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM courses WHERE studentId = ?', [studentId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }

}
export const getCourseById = async (req, res) => {
    const studentId = req.student.studentId;
    const courseId = req.params.id;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM courses WHERE studentId = ? AND courseId = ?', [studentId, courseId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Course are not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();

    
    }
}

export const updateCourseById = async (req, res) => {
    const studentId = req.student.studentId;
    const courseId = req.params.id;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    console.log(req.body)
        console.log(courseId)


    try {
        const { courseName, courseType, credits, targetScore } = req.body;

        // Build the query dynamically based on provided fields
        let query = 'UPDATE courses SET ';
        const fields = [];
        const values = [];

        if (courseName !== undefined) {
            fields.push('courseName = ?');
            values.push(courseName);
        }
        if (courseType !== undefined) {
            fields.push('courseType = ?');
            values.push(courseType);
        }
        if (credits !== undefined) {
            fields.push('credits = ?');
            values.push(credits);
        }
        if (targetScore !== undefined) {
            fields.push('targetScore = ?');
            values.push(targetScore);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        query += fields.join(', ') + ' WHERE studentId = ? AND courseId = ?';
        values.push(studentId, courseId);

        await conn.query(query, values);
        res.status(200).json({ message: 'Course updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

export const deleteCourseById = async (req, res) => {
    const studentId = req.student.studentId;
    const courseId = req.params.id;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        await conn.query('DELETE FROM courses WHERE studentId = ? AND courseId = ?', [studentId, courseId]);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

