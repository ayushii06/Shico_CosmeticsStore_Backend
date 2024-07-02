const RatingAndReview = require('../models/Rating.js');
const User = require('../models/UserModel.js');
const Product = require('../models/ProductModel.js');

exports.productBuyed = async (req, res) => {
    try{
        const id  = req.user.id;
        const { productId } = req.body;
    
        if (!id){
            return res.status(400).json({
                success:false,
                message:'User not found'
            })
        } 

        //check if user has buyed the product
        const buyer = await Product.findOne({
            _id: productId,
            buyer: { $elemMatch: { $eq: id } }
        })

        if (!buyer){
            return res.status(200).json({
                success:false,
                message:'You have not buyed this product'
            })
        } 
        else{
            return res.status(200).json({
                success:true,
                message:'You have buyed this product'
            })
        }


    }catch(err){
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}
exports.createRatingAndReview = async (req, res) => {
    try {
        const  id  = req.user.id;
        const { rating, review, productId } = req.body;
        if (!id){
            return res.status(400).json({
                success:false,
                message:'User not found'
            })
        } 

        //check if user has buyed the product
        const buyer = await Product.findOne({
            _id: productId,
            buyer: { $elemMatch: { $eq: id } }
        })



        if (!buyer){
            return res.status(400).json({
                success:false,
                message:'You have not buyed this product'
            })
        } 

        const product = await Product.findById(productId);

        const alreadyRated = product.ratings.find((rating) => rating.createdBy.toString() === id);
        if (alreadyRated){
            return res.status(400).json({
                success:false,
                message:'You have already rated this product'
            })
        } 


        const user = await User.findById(id);
        const ratingAndReview = await RatingAndReview.create({
            desc: review,
            rate: rating,
            createdBy: id,
            product: productId,
        });

        await Product.findByIdAndUpdate(productId, {
            $push: {
                ratings: ratingAndReview._id,
            }
        },
            {
                new: true,
            }
        )

        await ratingAndReview.save();
        return res.status(200).json({ success:true, message: "Rating and Review added successfully" });
    }
    catch (err) {
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

exports.updateRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        if (!id){
          return res.status(400).json({
                success:false,
                message:'User not found'
            })
        }
        const { rating, review, productId } = req.body;

        const ratingAndReview = await RatingAndReview.findOneAndUpdate({ createdBy: id, product: productId }, {
            desc: review,
            rate: rating,
        }, { new: true });

        if (!ratingAndReview){
          return res.status(400).json({
                success:false,
                message:'Rating and Review not found'
            })
        } 

      return res.status(200).json({ message: "Rating and Review updated successfully" });
    } catch (error) {
      return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        if (!id) {
          return res.status(400).json({
                success:false,
                message:'User not found'
            })}
        const { productId } = req.body;

        const ratingAndReview = await RatingAndReview.findOneAndDelete({ createdBy: id });

        if (!ratingAndReview){
          return res.status(400).json({
                success:false,
                message:'Rating and Review not found'
            })}


      return res.status(200).json({ message: "Rating and Review deleted successfully" });
    } catch (err) {
      return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

exports.avgRating = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId){
          return res.status(400).json({
                success:false,
                message:'Product Id not found'
            })
        } 

        const product = await RatingAndReview.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId),
                }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rate" },
                    totalRating: { $sum: 1 },
                }
            }

        ])

        if (Result.length > 0) {
            return res.status(200).json({
                success: true,
                avgRating: product[0].avgRating,
                totalRating: product[0].totalRating,
            })
        }

      return res.status(200).json({ success: true, message: 'No one has reviewed it yet!', avgRating: 0, totalRating: 0 });

    } catch (error) {
      return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.getRatingAndReview = async (req, res) => {
    try {
        const productId = req.params.productId;

        const data = RatingAndReview.findById({ product: productId })
            .populate({
                path: 'createdBy',
                select: 'name'
            }).exec();

        if (!data){
          return res.status(400).json({
                success:false,
                message:'No reviews found'
            })
        }

      return res.status(200).json({
            success: true,
            data: data,
        })
    }
    catch (err) {
      return res.status(400).json({
            success:false,
            message:err.message
        })
    }
}