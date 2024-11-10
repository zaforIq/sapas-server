import express from 'express'
const router=express.Router()

import authorizedStudent from '../middlewares/Authorized.js'
import { getAssesmentDetailsWithAchievedMark } from '../controllers/joinedController.js'

router.route('/assesmentDetailsWithAchievedMark/:id')
.get(authorizedStudent,getAssesmentDetailsWithAchievedMark)



export default router