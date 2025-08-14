import express from 'express';
import { PORT } from './secrets.js';
import helmet from 'helmet';
import { requestLogger } from './logger.js';
import { authRouter } from './auth/auth.routes.js';
import { uploadRouter } from './upload/uploads.routes.js';
import { recordRouter } from './records/records.routes.js';
import { errorHandler } from './middlewares/error.js';


const app = express()

app.use(helmet())
app.use(express.json())
app.use(requestLogger)

app.get('/auth', authRouter)
app.get('/upload', uploadRouter)
app.get('/records',recordRouter)

app.use(errorHandler)

app.listen(PORT, function(){
    console.log(`Server running on Port ${PORT}`)
})

