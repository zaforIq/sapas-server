import express from 'express'
const router=express.Router()
import authorizedStudent from '../middlewares/Authorized.js'
import { createMark } from '../controllers/marksController.js'




router.route('/')
.post(authorizedStudent,createMark)

export default router