const mongoose = require('mongoose');

//defining the order model
var orderSchema = new mongoose.Schema({
   user:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
   ],
    products:[
        {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            count: Number,
            price: Number,
          },
    ],
    totalPrice:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        default:"pending",
    },

});

//Export the model
module.exports = mongoose.model('Order', orderSchema);