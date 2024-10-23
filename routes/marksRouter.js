import express from 'express'
import authorizedStudent from '../middlewares/Authorized'
import {} from '../controllers/marksController'
const router=express.Router()


router.route('/')
.post(authorizedStudent,createMark)
.get(authorizedStudent,getMarks)


router.route('/:id')
.get(authorizedStudent,getMarkById)
.put(authorizedStudent,updateMarkById)
.delete(authorizedStudent,deleteMarkById)




export default router