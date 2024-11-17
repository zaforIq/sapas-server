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

export const getAssesmentDetailsWithAchievedMarkByAssesmentId = async (req, res) => {
const assesmentId=req.params.id
console.log(assesmentId)

    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query(`
            SELECT 
                assesments.assesmentId, 
                assesments.assesmentName, 
                assesments.totalMark AS highestMark, 
                marks.markObtained AS achievedMark
            FROM assesments
            INNER JOIN marks ON assesments.assesmentId = marks.assesmentId
            WHERE assesments.assesmentId = ?
        `, [assesmentId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}


export const getSummaryOfAParticularCourse = async (req, res) => {
    const courseId = req.params.id;
    console.log(courseId);

    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        // Fetch course information
        const [courseInfo] = await conn.query(`
            SELECT * FROM courses WHERE courseId = ?
        `, [courseId]);

        if (courseInfo.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Fetch assessments, marks, and total mark
        const [rows] = await conn.query(`
            SELECT 
                assesments.totalMark AS highestMark, 
                marks.markObtained AS achievedMark,
                (SELECT SUM(assesments.totalMark) 
                 FROM assesments 
                 WHERE assesments.courseId = ?) AS totalMark
            FROM courses
            INNER JOIN assesments ON courses.courseId = assesments.courseId
            INNER JOIN marks ON assesments.assesmentId = marks.assesmentId
            WHERE courses.courseId = ?
        `, [courseId, courseId]);

        // Extract total mark from the first row
        const totalMark = rows.length > 0 ? rows[0].totalMark : 0;

        res.status(200).json({
            courseInfo: courseInfo[0],
            assessments: rows,
            totalMark
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};


export const getSummaryOfAllCouresOfAStudent = async (req, res) => {
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();
    const studentId = req.student.studentId;

    try {
        // Find courses of the student
        const [courses] = await conn.query(`
            SELECT 
                courses.courseId,
                courses.courseName,
                courses.targetScore
            FROM courses
            WHERE courses.studentId = ?
        `, [studentId]);

        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for the student' });
        }

        // Fetch assessments and marks for the found courses
        const [rows] = await conn.query(`
            SELECT 
                courses.courseId,
                courses.courseName,
                courses.targetScore,
                (SELECT SUM(marks.markObtained) 
                 FROM marks 
                 INNER JOIN assesments ON marks.assesmentId = assesments.assesmentId
                 WHERE assesments.courseId = courses.courseId
                 ) AS achievedMark
            FROM courses
            INNER JOIN assesments ON courses.courseId = assesments.courseId
            INNER JOIN marks ON assesments.assesmentId = marks.assesmentId
            WHERE courses.courseId IN (?)
            GROUP BY courses.courseId
        `, [courses.map(course => course.courseId)]);

        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};


export const getparticularCourseDetailsAssesmentAchievedMarkIsNotNull= async (req, res) => {
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
            WHERE courses.courseId = ? AND marks.markObtained IS NOT NULL
        `, [courseId]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}