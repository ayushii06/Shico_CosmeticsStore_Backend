const { MongoClient, ServerApiVersion } = require("mongodb");
const { default: mongoose } = require("mongoose");
require('dotenv').config();

const uri = process.env.CONNECTION_STRING || "";

const db=async()=>{
   mongoose.connect(uri,
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}
    ).then(() =>{
        console.log("Database connected successfully");
    }).catch((err)=>{
        console.log("Database connection failed");
        console.log(err);
    });
 
}

module.exports= db;