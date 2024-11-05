import express from 'express';
import morgan from 'morgan';
import cors from 'cors'




export default (app)=>{
    app.use(express.json());
    app.use(cors());

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
    
}

