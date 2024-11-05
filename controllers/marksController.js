

export const createMark = async (req, res) => {
    const courseId =req.headers.courseId;
    const assesmentId = req.headers.assesmentId;
    const markObtained =req.body.markObtained;

    
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
       
        const [result] = await conn.query('INSERT INTO marks (courseId, assesmentId, markObtained) VALUES (?, ?, ?)', [courseId, assesmentId, markObtained]);
        res.status(201).json({ message: 'Mark created successfully' });
}
    catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}


export const getMarkByAssesmentId = async (req, res) => {
    const assesmentId = req.headers.assesmentId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM marks WHERE assesmentId = ?', [assesmentId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}

