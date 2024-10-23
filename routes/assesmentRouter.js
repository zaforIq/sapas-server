import express from 'express'
const router=express.Router()

import authorizedStudent from '../middlewares/Authorized.js'
import {createAssesment,getAssesmentById,getAssesments,updateAssesmentById,deleteAssesmentById} from '../controllers/assesmentController.js'


router.route('/')
.post(authorizedStudent,createAssesment)
.get(authorizedStudent,getAssesments)



router.route('/:id')
.get(authorizedStudent,getAssesmentById)
.put(authorizedStudent,updateAssesmentById)
.delete(authorizedStudent,deleteAssesmentById)





export default router