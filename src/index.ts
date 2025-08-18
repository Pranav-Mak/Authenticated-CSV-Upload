import express from 'express';
import { PORT } from './secrets.js';
import helmet from 'helmet';
import { requestLogger } from './logger.js';
import { authRouter } from './auth/auth.routes.js';
import { uploadRouter } from './upload/uploads.routes.js';
import { recordRouter } from './records/records.routes.js';
import { errorHandler } from './middlewares/error.js';
import path from 'path';
import cookieParser from 'cookie-parser';


const app = express()

app.use(express.static(path.join(process.cwd(), 'public')));

app.use(helmet())
app.use(express.json())
app.use(requestLogger)
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/records',recordRouter)

app.use(errorHandler)

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`)
})

