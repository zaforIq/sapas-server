import express from 'express'
const router=express.Router()

import { createNote, createQuestion, getNotes, getQuestions, getSingleNote, getSingleQuestion } from '../controllers/communityController.js'
import { noteUpload, questionUpload } from '../middlewares/multer.js'




router.route('/question')
.get(getQuestions)
.post(questionUpload,createQuestion)

router.route('/question/:path')
.get(getSingleQuestion)



router.route('/note')
.get(getNotes)
.post(noteUpload,createNote)


router.route('/note/:path')
.get(getSingleNote)





export default router