const { mongoose } = require("mongoose");
require('dotenv').config();

const uri = process.env.CONNECTION_STRING || "";

// Attempt to connect to the MongoDB database using the connection string
exports.connect = () => {
    mongoose.connect(uri, )
    .then(() => console.log("DB Connected Successfully"))
    .catch( (error) => {
        console.log("DB Connection Failed");
        console.error(error);
        process.exit(1);
    } )
};
