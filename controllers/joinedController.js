export const getAssesmentDetailsWithAchievedMark = async (req, res) => {

const courseId=req.params.id
console.log(courseId)

    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query(`
            SELECT 
                assesments.assesmentId, 
                assesments.assesmentName, 
                assesments.totalMark AS highestMark, 
                marks.markObtained AS achievedMark
            FROM courses
            INNER JOIN assesments ON courses.courseId = assesments.courseId
            INNER JOIN marks ON assesments.assesmentId = marks.assesmentId
            WHERE courses.courseId = ?
        `, [courseId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}