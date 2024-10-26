

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

export const getTotalObtainedMark = async (req, res) => {
    const studentId = req.student.studentId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {

        const [courses] = await conn.query('SELECT DISTINCT courseId FROM courses WHERE studentId = ?', [studentId]);

        const results = [];

        for (const course of courses) {
            const courseId = course.courseId;

         
            const [courseDetails] = await conn.query('SELECT courseName FROM courses WHERE courseId = ?', [courseId]);
            const courseName = courseDetails[0].courseName;

            const [assesments] = await conn.query('SELECT assesmentName, highestMark FROM assesments WHERE courseId = ?', [courseId]);

            for (const assesment of assesments) {
                const assesmentName = assesment.assesmentName;
                const highestMark = assesment.highestMark;

                const [mark] = await conn.query('SELECT markObtained FROM marks WHERE courseId = ? AND assesmentId = ?', [courseId, assesment.assesmentId]);
                const markObtained = mark[0].markObtained;

                results.push({
                    courseName,
                    assesmentName,
                    highestMark,
                    markObtained
                });
            }
        }


        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
}


export const getTotalObtainedMarkInACourse = async (req, res) => {
    const courseId = req.headers.courseId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [courseDetails] = await conn.query('SELECT courseName FROM courses WHERE courseId = ?', [courseId]);
        const courseName = courseDetails[0].courseName;

        const [assesments] = await conn.query('SELECT assesmentName, highestMark FROM assesments WHERE courseId = ?', [courseId]);

        const results = [];

        for (const assesment of assesments) {
            const assesmentName = assesment.assesmentName;
            const highestMark = assesment.highestMark;

            const [mark] = await conn.query('SELECT markObtained FROM marks WHERE courseId = ? AND assesmentId = ?', [courseId, assesment.assesmentId]);
            const markObtained = mark[0].markObtained;

            results.push({
                courseName,
                assesmentName,
                highestMark,
                markObtained
            });
        }

        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }


 
}

export const updateMarkById = async (req, res) => {
    const markId = req.params.markId;
    const markObtained = req.body.markObtained;

    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query('UPDATE marks SET markObtained = ? WHERE markId = ?', [markObtained, markId]);
        res.status(200).json({ message: 'Mark updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
 
}

export const deleteMarkById = async (req, res) => {
    const markId = req.params.markId;

    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query('DELETE FROM marks WHERE markId = ?', [markId]);
        res.status(200).json({ message: 'Mark deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }

}


export const getRequiredScores = async (req, res) => {
    const studentId = req.student.studentId;
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        const [courses] = await conn.query('SELECT DISTINCT courseId FROM courses WHERE studentId = ?', [studentId]);

        const results = [];

       
        for (const course of courses) {
            const courseId = course.courseId;

            const [courseDetails] = await conn.query('SELECT courseName, targetMark FROM courses WHERE courseId = ?', [courseId]);
            const courseName = courseDetails[0].courseName;
            const targetMark = courseDetails[0].targetMark;

           
            const [assesments] = await conn.query('SELECT assesmentName, highestMark FROM assesments WHERE courseId = ?', [courseId]);

            let totalMarkObtained = 0;
            let totalHighestMark = 0;

            for (const assesment of assesments) {
                const highestMark = assesment.highestMark;

                const [mark] = await conn.query('SELECT markObtained FROM marks WHERE courseId = ? AND assesmentId = ?', [courseId, assesment.assesmentId]);
                const markObtained = mark[0].markObtained;

                totalMarkObtained += markObtained;
                totalHighestMark += highestMark;
            }

            const percentage = (totalMarkObtained / totalHighestMark) * 100;
            const requiredMark = targetMark - totalMarkObtained;

           
            const [leftAssesments] = await conn.query('SELECT COUNT(*) as count FROM marks WHERE courseId = ? AND markObtained IS NULL', [courseId]);
            const count = leftAssesments[0].count;

            const requiredMarkPerAssesment = requiredMark / count;

            results.push({
                courseName,
                targetMark,
                percentage,
                requiredMark,
                requiredMarkPerAssesment
            });
           
        }


        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};