import studentRouter from '../routes/studentRouter.js'


export default (app)=>{
    app.use('/api/student',studentRouter)

}