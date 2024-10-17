import express from 'express'
const router=express.Router()

import authorizedStudent from '../middlewares/Authorized.js'
import { getAssesmentDetails } from '../controllers/assesmentController.js'


router.route('/')
.get(authorizedStudent,getAssesmentDetails)



export default router