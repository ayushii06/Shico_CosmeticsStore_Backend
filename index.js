const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser')
const db =require('./config/connection.js');
const cors = require('cors')
const authRouter = require('./routes/auth.js')
const productRouter = require('./routes/ProductRoute.js')
const profileRouter = require('./routes/ProfileRoute.js')
const cartRouter = require('./routes/CartRoutes.js')
const reviewRouter = require('./routes/ReviewRoute.js')
const orderRouter = require('./routes/OrderRoute.js')
const fileupload = require('express-fileupload')
const { cloudinaryConnect } = require('./config/cloudinary.js')

// Connect to the database
db.connect();

// Set up the API base URL and port from environment variables
const api = process.env.API_URL;
const PORT =  5050;
const app = express();
app.use(cors());  // Enable CORS for all routes

// Set up path module for static file serving
const path = require("path");

// Serve static files from the 'build' directory (for frontend deployment)
app.use(express.static(path.join(__dirname, "build"))); 

// Configure file upload middleware with temporary file storage
app.use(fileupload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}))

// Connect to Cloudinary for media file uploads
cloudinaryConnect();

// Configure body parser middleware to handle JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Define the API routes for different services (authentication, product, etc.)
app.use(`${api}/user`,authRouter)
app.use(`${api}/product`,productRouter)
app.use(`${api}/cart`,cartRouter)
app.use(`${api}/rating`,reviewRouter)
app.use(`${api}/profile`,profileRouter)
app.use(`${api}/order`,orderRouter)

// Start the Express server and listen on the defined port
app.listen(PORT, () => {
  console.log(api)
  console.log(`Server listening on port localhost "http://localhost:${PORT}"`);
});
