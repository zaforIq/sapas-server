import {getCourses,getCourseById,setCourse,updateCourseById,deleteCourseById} from '../controllers/coursesController.js'
import authorizedStudent from '../middlewares/Authorized.js'

import express from 'express'
const router=express.Router()

router.route('/')
.get(authorizedStudent,getCourses)
.post(authorizedStudent,setCourse)


router.route('/:id')
.get(authorizedStudent,getCourseById)
.put(authorizedStudent,updateCourseById)
.delete(authorizedStudent,deleteCourseById)

export default router