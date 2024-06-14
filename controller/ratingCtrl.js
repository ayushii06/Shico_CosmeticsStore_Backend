const RatingAndReview = require('../models/Rating.js');
const User = require('../models/UserModel.js');
const Product = require('../models/ProductModel.js');

exports.createRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        const { rating, review, productId } = req.body;
        if (!id){
            res.status(400).json({
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
            res.status(400).json({
                success:false,
                message:'You have not buyed this product'
            })
        } 

        const product = await Product.findById(productId);

        const alreadyRated = product.ratings.find((rating) => rating.createdBy.toString() === id);
        if (alreadyRated){
            res.status(400).json({
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

        Product.findByIdAndUpdate(productId, {
            $push: {
                ratings: ratingAndReview._id,
            }
        },
            {
                new: true,
            }


        )

        await ratingAndReview.save();
        res.status(200).json({ success:true, message: "Rating and Review added successfully" });
    }
    catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

exports.updateRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        if (!id){
            res.status(400).json({
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
            res.status(400).json({
                success:false,
                message:'Rating and Review not found'
            })
        } 

        res.status(200).json({ message: "Rating and Review updated successfully" });
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.deleteRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        if (!id) {
            res.status(400).json({
                success:false,
                message:'User not found'
            })}
        const { productId } = req.body;

        const ratingAndReview = await RatingAndReview.findOneAndDelete({ createdBy: id });

        if (!ratingAndReview){
            res.status(400).json({
                success:false,
                message:'Rating and Review not found'
            })}


        res.status(200).json({ message: "Rating and Review deleted successfully" });
    } catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

exports.avgRating = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId){
            res.status(400).json({
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

        res.status(200).json({ success: true, message: 'No one has reviewed it yet!', avgRating: 0, totalRating: 0 });

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.getRatingAndReview = async (req, res) => {
    try {
        const productId = req.params.productId;

        const data = RatingAndReview.find({ product: productId })
            .populate({
                path: 'createdBy',
                select: 'name'
            })
            .sort({ rating: desc })
            .exec();

        if (!data){
            res.status(400).json({
                success:false,
                message:'No reviews found'
            })
        }

        res.status(200).json({
            success: true,
            data: data,
        })
    }
    catch (err) {
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}