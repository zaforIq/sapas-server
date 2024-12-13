import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the directories exist
const ensureDirectoryExistence = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configure storage for questions
const questionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/questions';
        ensureDirectoryExistence(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

// Configure storage for notes
const noteStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/notes';
        ensureDirectoryExistence(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

const uploadQuestion = multer({ storage: questionStorage });
const uploadNote = multer({ storage: noteStorage });

export const noteUpload = uploadNote.single('note');
export const questionUpload = uploadQuestion.single('question');