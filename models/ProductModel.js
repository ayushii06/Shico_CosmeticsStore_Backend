const mongoose = require('mongoose'); 

var productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,

  },
  selling_price: {
    type: Number,
    required: true,

  },
  market_price: {
    type: Number,
    required: true,

  },
  stock:{
    type:Number,
    required:true,
  },
  category: {
    type: String,
    required: true,
  },
  imgsrc:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'File'
  },
  imghoversrc:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'File'
  },
  tags: [],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
    },
  ],
  totalrating: {
    type: String,
    default: 0,
  },
},
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);