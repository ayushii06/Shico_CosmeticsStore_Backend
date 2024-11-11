const Category = require('../models/CategoryModel');

// Controller function to create a new category
exports.createCategory = async(req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.create({
            name,
            description
        });
        res.status(200).json({ message: "Category created successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Controller function to update an existing category by ID
exports.updateCategory = async(req, res) => {
    try {
        const { name, description, id } = req.body;
        const category = await Category.findByIdAndUpdate(id, {
            name,
            description
        }, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ message: "Category updated successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Controller function to delete a category by ID
exports.deleteCategory = async(req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Controller function to get products in a specific category
exports.categoryProducts = async(req, res) => {
    try {
        // Get the category ID from the request body
        const { category_id } = req.body;

        // Find the category by ID and populate its products with selected fields
        const category = await Category.findById(category_id).populate({
            path: 'products',
            select: 'product_name desc selling_price market_price imgsrc imghoversrc avgRating'
        }).exec();

        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Category Not Found'
            });
        }

        // Get all products within the specified category
        const products = category.products;
        res.status(200).json({
            success: true,
            products
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

// Controller function to get the top 5 highest-rated products across all categories
exports.topSellingProducts = async(req, res) => {
    try {
        const products = await Category.find().populate({
            path: 'products',
            select: 'product_name desc selling_price market_price imgsrc imghoversrc avgRating',
            options: { limit: 5, sort: { avgRating: -1 } } // Limit to top 5 products, sorted by average rating in descending order
        }).exec();

        res.status(200).json({
            success: true,
            products
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
