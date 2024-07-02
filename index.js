const express = require('express')
require('dotenv').config();
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");
const bodyParser = require('body-parser')
const db=require('./config/connection.js');
const authRouter = require('./routes/auth.js')
const cors = require('cors')
const productRouter = require('./routes/ProductRoute.js')
const profileRouter = require('./routes/ProfileRoute.js')
const cartRouter = require('./routes/CartRoutes.js')
const reviewRouter = require('./routes/ReviewRoute.js')
const fileupload = require('express-fileupload')
const { cloudinaryConnect } = require('./config/cloudinary.js')

db.connect();

const api = process.env.API_URL;
//http://localhost:5050/api/shico
const PORT =  5050;
const app = express();
app.use(cors());

const path = require("path");
app.use(express.static(path.join(__dirname, "build"))); 
app.use(fileupload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}))
cloudinaryConnect();


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(`${api}/user`,authRouter)
app.use(`${api}/product`,productRouter)
app.use(`${api}/cart`,cartRouter)
app.use(`${api}/rating`,reviewRouter)
app.use(`${api}/profile`,profileRouter)


app.use(notFound);
app.use(errorHandler);
// start the Express server
app.listen(PORT, () => {
  console.log(api)
  console.log(`Server listening on port localhost "http://localhost:${PORT}"`);
});