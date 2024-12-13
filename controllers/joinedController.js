export const getAssesmentDetailsWithAchievedMark = async (req, res) => {

const courseId=req.params.id


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


export const getAssesmentDetailsWithRequiredMark = async (req, res) => {
    const courseId = req.params.id
    const studentId = req.student.studentId; // Assuming studentId is available in req.student
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        // Fetch the target score set by the student for the course
        const [targetResult] = await conn.query(`
            SELECT targetScore FROM courses WHERE courseId = ? AND studentId = ?
        `, [courseId, studentId]);

        if (targetResult.length === 0) {
            return res.status(404).json({ message: 'Course not found or no target score set' });
        }

        const targetScore = targetResult[0].targetScore;

        // Fetch marks and assessments for the specified course
        const [assesments] = await conn.query(`
            SELECT 
                a.assesmentId,
                a.assesmentName,
                a.totalMark AS highestMark,
                IFNULL(m.markObtained, NULL) AS markObtained
            FROM 
                assesments a
                LEFT JOIN marks m ON a.assesmentId = m.assesmentId
            WHERE 
                a.courseId = ?
        `, [courseId]);

        if (assesments.length === 0) {
            return res.status(404).json({ message: 'No assessments found for the course' });
        }

        // Calculate the sum of obtained marks for assessments that have already happened
        let totalMarksObtained = 0;
        let remainingAssesments = [];

        assesments.forEach(assesment => {
            if (assesment.markObtained !== null) {
                if (assesment.assesmentName==="Quiz 1" || assesment.assesmentName==="Quiz 2" || assesment.assesmentName==="Quiz 3" || assesment.assesmentName==="Quiz 4" || assesment.assesmentName==="Quiz 5") {
                    totalMarksObtained += Number(assesment.markObtained)/3;
                } else {
                totalMarksObtained += Number(assesment.markObtained);
                }
            } else {
                remainingAssesments.push(assesment);
            }
        });

        // Calculate the score needed to reach the target
        const remainingScoreNeeded = targetScore - totalMarksObtained;

        // If the target is already met or exceeded
        if (remainingScoreNeeded <= 0) {
            return res.status(200).json({ 
                message: 'Target already achieved or exceeded!',
                targetScore: targetScore,
                totalMarksObtained: totalMarksObtained
            });
        }

        // Calculate the total percentage of the remaining assessments
        const totalPercentage = remainingAssesments.reduce((sum, assesment) => {
            if (/^Quiz\s\d+$/i.test(assesment.assesmentName)) {
                return sum + 5;
            }
            return sum + Number(assesment.highestMark);
        }, 0);

        // Distribute the required marks among remaining assessments
        const requiredMarksDistribution = remainingAssesments.map(assesment => {
            let percentage = assesment.highestMark;
            if (/^Quiz\s\d+$/i.test(assesment.assesmentName)) {
                percentage = 5;
            }
            const requiredMark = (percentage / totalPercentage) * remainingScoreNeeded;
            return {
                assesmentName: assesment.assesmentName,
                highestMark: assesment.highestMark,
                requiredMark: Math.round(requiredMark * 100) / 100 // Round to 2 decimal places
            };
        });

        // Send response with the required marks for each assessment left
        res.status(200).json({
            targetScore: targetScore,
            totalMarksObtained: totalMarksObtained,
            remainingScoreNeeded: remainingScoreNeeded,
            requiredMarksDistribution: requiredMarksDistribution
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};


export const getCoursesWithMarksAndTarget = async (req, res) => {
    const studentId = req.student.studentId; // Assuming studentId is available in req.student
    const pool = req.app.get('pool');
    const conn = await pool.getConnection();

    try {
        // Find all courses of the student
        const [courses] = await conn.query(`
            SELECT 
                courseId,
                courseName,
                targetScore
            FROM courses
            WHERE studentId = ?
        `, [studentId]);

        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for the student' });
        }

        // Initialize an array to hold the results
        const results = [];

        // Loop through each course to find assessments and marks
        for (const course of courses) {
            const [assessments] = await conn.query(`
                SELECT 
                    assesmentId,
                    assesmentName,
                    totalMark AS highestMark
                FROM assesments
                WHERE courseId = ?
            `, [course.courseId]);

            let totalMarksObtained = 0;

            // Loop through each assessment to find marks
            for (const assessment of assessments) {
                const [marks] = await conn.query(`
                    SELECT 
                        markObtained
                    FROM marks
                    WHERE assesmentId = ?
                `, [assessment.assesmentId]);

                // Sum the marks obtained for the assessment
                marks.forEach(mark => {
                    if (mark.markObtained !== null) {
                        totalMarksObtained += Number(mark.markObtained);
                    }
                });
            }

            // Calculate the remaining score needed to reach the target
            const remainingScoreNeeded = course.targetScore - totalMarksObtained;

            // Add the course information and calculated values to the results array
            results.push({
                courseId: course.courseId,
                courseName: course.courseName,
                targetScore: course.targetScore,
                totalMarksObtained: totalMarksObtained,
                remainingScoreNeeded: remainingScoreNeeded
            });
        }

        // Send the results as the response
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    } finally {
        conn.release();
    }
};




