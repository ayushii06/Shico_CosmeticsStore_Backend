const { ApiError } = require('../middlewares/ApiError.js');
const RatingAndReview = require('../models/ratingandreview');
const User = require('../models/UserModel.js');
const Product = require('../models/ProductModel.js');
const { rating } = require('./productCtrl.js');

exports.createRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        const { rating, review, productId } = req.body;
        if (!id) throw new ApiError(400, "User not found");

        //check if user has buyed the product
        const buyer = await Product.findOne({
            _id: productId,
            buyer: { $elemMatch: { $eq: id } }
        })

        if (!buyer) throw new ApiError(400, "You have not buyed this product");

        const product = await Product.findById(productId);

        const alreadyRated = product.ratings.find((rating) => rating.createdBy.toString() === id);
        if (alreadyRated) throw new ApiError(400, "You have already rated this product");


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
        res.status(200).json({ message: "Rating and Review added successfully" });
    }
    catch (err) {
        throw new ApiError(400, err.message)
    }
}

exports.updateRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        if (!id) throw new ApiError(400, "User not found");
        const { rating, review, productId } = req.body;

        const ratingAndReview = await RatingAndReview.findOneAndUpdate({ createdBy: id, product: productId }, {
            desc: review,
            rate: rating,
        }, { new: true });

        if (!ratingAndReview) throw new ApiError(400, "Rating and Review not found");

        res.status(200).json({ message: "Rating and Review updated successfully" });
    } catch (error) {
        throw new ApiError(400, error.message)
    }
}

exports.deleteRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id;
        if (!id) throw new ApiError(400, "User not found");
        const { productId } = req.body;

        const ratingAndReview = await RatingAndReview.findOneAndDelete({ createdBy: id });

        if (!ratingAndReview) throw new ApiError(400, "Rating and Review not found");

        res.status(200).json({ message: "Rating and Review deleted successfully" });
    } catch (err) {
        throw new ApiError(400, err.message)
    }
}

exports.avgRating = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) throw new ApiError(400, "Product Id not found");

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
        throw new ApiError(400, error.message)
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

        if (!data) throw new ApiError(400, "No reviews found");

        res.status(200).json({
            success: true,
            data: data,
        })
    }
    catch (err) {
        throw new ApiError(400, err.message)
    }
}