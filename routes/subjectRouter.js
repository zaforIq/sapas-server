import express from 'express'
const router=express.Router()
import { getSubjectDetails } from '../controllers/subjectController.js'
import authorizedStudent from '../middlewares/Authorized.js'



router.route('/')
.get(authorizedStudent,getSubjectDetails)

export default router