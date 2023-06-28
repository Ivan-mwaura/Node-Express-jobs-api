require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//extra security packagees
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//connectDB
const connectDB = require('./db/connect')

//routers

const authRouter = require('./routes/auth') 
const jobsRouter = require('./routes/jobs')
const authenticateUser  = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
)
app.use(express.json());
// extra packages
app.use(helmet())
app.use(cors())
app.use(xss())

//dummy test route
app.get('/',(req, res)=>{
  res.send('jobs api')
})


// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser, jobsRouter)

//error middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
