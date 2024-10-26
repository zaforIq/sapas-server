

export const createAssesment = async (req, res) => {
    const courseId = req.headers.courseid 
    const conn = await pool.getConnection();
    
    try {
        const { assesmentName, highestMark } = req.body;
        const assesment=await conn.query('SELECT * FROM assesments WHERE assesmentName = ? AND courseId = ?', [assesmentName, courseId]);
        if (assesment[0].length > 0) {
            return res.status(400).json({ message: 'Assesment already exists' });
        }
        await conn.query('INSERT INTO assesments (assesmentName, highestMark, courseId) VALUES (?, ?, ?)', [assesmentName, highestMark, courseId]);
        res.status(201).json({ message: 'Assesment created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

export const getAssesments = async (req, res) => {
    const courseId = req.headers['courseid']; 
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM assesments WHERE courseId = ?', [courseId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};

export const getAssesmentById = async (req, res) => {
    const assesmentId = req.params.id;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    console.log(assesmentId)
    try {
        const [rows] = await conn.query('SELECT * FROM assesments WHERE assesmentId = ?', [assesmentId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Assesment not found' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

export const updateAssesmentById = async (req, res) => {
    const assesmentId = req.params.id;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const { assesmentName, highestMark} = req.body;
        await conn.query('UPDATE assesments SET assesmentName = ?, highestMark = ? WHERE assesmentId = ?', [assesmentName, highestMark, assesmentId]);
        res.status(200).json({ message: 'Assesment updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

export const deleteAssesmentById = async (req, res) => {

    const assesmentId = req.params.id;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        await conn.query('DELETE FROM assesments WHERE assesmentId = ?', [assesmentId]);
        res.status(200).json({ message: 'Assesment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}
