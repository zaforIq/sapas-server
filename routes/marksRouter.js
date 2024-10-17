import express from 'express'
import authorizedStudent from '../middlewares/Authorized'
import { getMarks } from '../controllers/marksController'
const router=express.Router()


router.route('/')
.get(authorizedStudent,getMarks)


export default router