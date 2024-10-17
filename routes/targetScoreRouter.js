import express from 'express'
import authorizedStudent from '../middlewares/Authorized'
import { getTargetScores } from '../controllers/targetScoreControler'
const router=express.Router()


router.route('/')
.get(authorizedStudent,getTargetScores)


export default router