CREATE VIEW course_summary AS
SELECT 
    c.courseId,
    c.courseName,
    c.targetScore,
    COALESCE(SUM(m.markObtained), 0) AS totalMarksObtained,
    c.targetScore - COALESCE(SUM(m.markObtained), 0) AS remainingScoreNeeded
FROM 
    courses c
LEFT JOIN 
    assesments a ON c.courseId = a.courseId
LEFT JOIN 
    marks m ON a.assesmentId = m.assesmentId
GROUP BY 
    c.courseId, c.courseName, c.targetScore;