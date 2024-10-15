import {signUp,logIn, getStudentDetails, updateStudentDetails, deleteStudent} from '../controllers/studentController.js'
import authorizedStudent from '../middlewares/Authorized.js'

import express from 'express'
const router=express.Router()



router.route('/signup')
.post(signUp)

router.route('/login')
.post(logIn)

//create a route to find out the user details
router.route('/')
.get(authorizedStudent,getStudentDetails)
.put(authorizedStudent,updateStudentDetails)
.delete(authorizedStudent,deleteStudent)


export default router