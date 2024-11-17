import express from 'express'
const router=express.Router()
import authorizedStudent from '../middlewares/Authorized.js'
import { createMark,updateMark } from '../controllers/marksController.js'




router.route('/')
.post(authorizedStudent,createMark)

router.route('/:id')
.put(authorizedStudent,updateMark)

export default router