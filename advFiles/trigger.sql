DELIMITER //

CREATE TRIGGER remove_assessment_after_insert
AFTER INSERT ON marks
FOR EACH ROW
BEGIN
    IF NEW.markObtained IS NOT NULL THEN
        DELETE FROM assesments WHERE assesmentId = NEW.assesmentId;
    END IF;
END //

CREATE TRIGGER remove_assessment_after_update
AFTER UPDATE ON marks
FOR EACH ROW
BEGIN
    IF NEW.markObtained IS NOT NULL THEN
        DELETE FROM assesments WHERE assesmentId = NEW.assesmentId;
    END IF;
END //

DELIMITER ;



DELIMITER //

CREATE PROCEDURE calculate_course_summary(
    IN courseId INT,
    OUT totalMarksObtained INT,
    OUT remainingScoreNeeded INT
)
BEGIN
    DECLARE targetScore INT;

    -- Get the target score for the course
    SELECT targetScore INTO targetScore
    FROM courses
    WHERE courseId = courseId;

    -- Calculate the total marks obtained for the course
    SELECT COALESCE(SUM(m.markObtained), 0) INTO totalMarksObtained
    FROM assesments a
    LEFT JOIN marks m ON a.assesmentId = m.assesmentId
    WHERE a.courseId = courseId;

    -- Calculate the remaining score needed to reach the target score
    SET remainingScoreNeeded = targetScore - totalMarksObtained;
END //

DELIMITER ;