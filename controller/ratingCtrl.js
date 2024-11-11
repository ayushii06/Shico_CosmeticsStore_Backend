const RatingAndReview = require('../models/Rating.js');
const Product = require('../models/ProductModel.js');

//creating the review
exports.createRatingAndReview = async (req, res) => {
    try {
        const id = req.user.id; // Get user ID from the authenticated user
        const { rating, review, productId } = req.body; // Get rating, review, and productId from the request body

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if the user has purchased the product
        const buyer = await Product.findOne({
            _id: productId,
            buyer: { $elemMatch: { $eq: id } } // Ensure that the user's ID is in the product's buyer list
        });

        if (!buyer) {
            return res.status(400).json({
                success: false,
                message: 'You have not bought this product'
            });
        }

        const product = await Product.findById(productId);

        // Check if the user has already rated the product
        const alreadyRated = product.ratings.find((rating) => rating.createdBy.toString() === id);
        if (alreadyRated) {
            return res.status(400).json({
                success: false,
                message: 'You have already rated this product'
            });
        }

        const ratingAndReview = await RatingAndReview.create({
            desc: review,
            rate: rating,
            createdBy: id,
            product: productId,
        });

        // Push the new rating to the product's ratings array
        await Product.findByIdAndUpdate(productId, {
            $push: {
                ratings: ratingAndReview._id, // Add the new rating to the product
            }
        }, {
            new: true,
        });

        // Save the rating and review
        await ratingAndReview.save();

        return res.status(200).json({
            success: true,
            message: "Rating and Review added successfully"
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

//updating the review
exports.updateRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id; // Get user ID from the authenticated user

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        const { rating, review, productId } = req.body; // Get rating, review, and productId from the request body

        // Find the review created by this user for the given product and update it
        const ratingAndReview = await RatingAndReview.findOneAndUpdate({ createdBy: id, product: productId }, {
            desc: review,
            rate: rating,
        }, { new: true });

        if (!ratingAndReview) {
            return res.status(400).json({
                success: false,
                message: 'Rating and Review not found'
            });
        }

        return res.status(200).json({ message: "Rating and Review updated successfully" });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

//deleting the review
exports.deleteRatingAndReview = async (req, res) => {
    try {
        const { id } = req.user.id; // Get user ID from the authenticated user

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find and delete the review created by this user
        const ratingAndReview = await RatingAndReview.findOneAndDelete({ createdBy: id });

        if (!ratingAndReview) {
            return res.status(400).json({
                success: false,
                message: 'Rating and Review not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating and Review deleted successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

//finding the average rating
exports.avgRating = async (req, res) => {
    try {
        const { productId } = req.body; // Get productId from the request body

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product Id not found'
            });
        }

        // Aggregate the ratings for the product and calculate the average rating and total rating count
        const product = await RatingAndReview.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId), // Match ratings for the given product
                }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rate" }, // Calculate average rating
                    totalRating: { $sum: 1 }, // Count total number of ratings
                }
            }
        ]);

        if (product.length > 0) {
            return res.status(200).json({
                success: true,
                avgRating: product[0].avgRating,
                totalRating: product[0].totalRating,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'No one has reviewed it yet!',
            avgRating: 0,
            totalRating: 0
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

//get reviews
exports.getRatingAndReview = async (req, res) => {
    try {
        const productId = req.params.productId; // Get the productId from the URL params

        // Find the reviews for the given product and populate the createdBy field with user details
        const data = await RatingAndReview.find({ product: productId })
            .populate({
                path: 'createdBy', // Populate the user details for the creator of the review
                select: 'name' // Only select the user's name
            }).exec();

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'No reviews found'
            });
        }

        return res.status(200).json({
            success: true,
            data: data,
        });
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}
