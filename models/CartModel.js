const mongoose = require("mongoose");

//creating the cart model

var cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      productName: String,
      imgsrc: String,
      count: Number,
      price: Number,
    },
  ],
  cartTotal: Number,
  orderby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Cart", cartSchema);