import studentRouter from '../routes/studentRouter.js'
import courseRouter from '../routes/coursesRoute.js'
import assesmentRouter from '../routes/assesmentRouter.js'
import marksRouter from '../routes/marksRouter.js'
import joinedRouter from '../routes/joinedRouter.js'


export default (app)=>{
    app.use('/api/student',studentRouter)
    app.use('/api/course',courseRouter)
    app.use('/api/assesment',assesmentRouter)
    app.use('/api/mark',marksRouter)
    app.use('/api/joined',joinedRouter)

}