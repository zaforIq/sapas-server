import express from 'express'
const router=express.Router()
import authorizedStudent from '../middlewares/Authorized.js'
import {createMark,getMarks,getMarkById,updateMarkById,deleteMarkById} from '../controllers/marksController.js'


router.route('/')
.post(authorizedStudent,createMark)
.get(authorizedStudent,getMarks)


router.route('/:id')
.get(authorizedStudent,getMarkById)
.put(authorizedStudent,updateMarkById)
.delete(authorizedStudent,deleteMarkById)




export default router