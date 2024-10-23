import studentRouter from '../routes/studentRouter.js'
import courseRouter from '../routes/coursesRoute.js'


export default (app)=>{
    app.use('/api/student',studentRouter)
    app.use('/api/course',courseRouter)
   

}