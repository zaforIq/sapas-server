import studentRouter from '../routes/studentRouter.js'
import subjectRouter from '../routes/subjectRouter.js'
import assesmentRouter from '../routes/assesmentRouter.js'


export default (app)=>{
    app.use('/api/student',studentRouter)
    app.use('/api/subject',subjectRouter)
    app.use('/api/assesment',assesmentRouter)

}