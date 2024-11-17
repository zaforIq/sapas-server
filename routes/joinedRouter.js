import express from 'express'
const router=express.Router()

import authorizedStudent from '../middlewares/Authorized.js'
import { getAssesmentDetailsWithAchievedMark,getAssesmentDetailsWithAchievedMarkByAssesmentId,getSummaryOfAParticularCourse,getSummaryOfAllCouresOfAStudent,getparticularCourseDetailsAssesmentAchievedMarkIsNotNull } from '../controllers/joinedController.js'

router.route('/assesmentDetailsWithAchievedMark/:id')
.get(authorizedStudent,getAssesmentDetailsWithAchievedMark)

router.route('/assesmentDetailsWithAchievedMarkByAssesmentId/:id')
.get(authorizedStudent,getAssesmentDetailsWithAchievedMarkByAssesmentId)

router.route('/getSummaryOfAParticularCourse/:id')
.get(authorizedStudent,getSummaryOfAParticularCourse)
router.route('/getSummaryOfAllCouresOfAStudent/:id')
.get(authorizedStudent,getSummaryOfAllCouresOfAStudent)

router.route('/getparticularCourseDetailsAssesmentAchievedMarkIsNotNull/:id')
.get(authorizedStudent,getparticularCourseDetailsAssesmentAchievedMarkIsNotNull)





export default router