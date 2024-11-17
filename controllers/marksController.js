

export const createMark = async (req, res) => {

    const assesmentId = req.body.assesmentId;
    const markObtained =req.body.markObtained;

    
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
       
        const [result] = await conn.query('INSERT INTO marks (assesmentId, markObtained) VALUES (?, ?)', [assesmentId, markObtained]);
        res.status(201).json({ message: 'Mark created successfully' });
}
    catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}


export const updateMark = async (req, res) => {

  console.log(req.body)
    const assesmentId = req.params.id;
    const markObtained = req.body.markObtained;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query('UPDATE marks SET markObtained = ? WHERE assesmentId = ?', [markObtained, assesmentId]);
        res.status(200).json({ message: 'Mark updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}
