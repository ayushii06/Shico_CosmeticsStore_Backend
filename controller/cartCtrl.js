const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');

// Controller function to get items in a user's cart
exports.get_cart_items = async (req, res) => {
    try {
        // Extract the user ID from the request object (assuming authentication middleware sets req.user)
        const userId = req.user.id;

        // Find the cart associated with the user and populate product details in each cart item
        let cart = await Cart.find({ orderby: userId }).populate(
            'products.product' // Populate the product field in each cart item with the full product details
        );

        // Check if the cart has any items and respond accordingly
        if (cart && cart.length > 0) {
            res.status(200).json({
                success: true,
                cart
            });
        } else {
            res.status(200).json({
                success: true,
                cart: null,
                message: 'Your Cart Is Empty'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

// Controller function to add an item to the cart
exports.add_cart_item = async (req, res) => {
    try {
        // Extract user ID and item details from the request object
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // Find the user's cart and the product to be added
        let cart = await Cart.findOne({ orderby: userId });
        let item = await Product.findOne({ _id: productId });

        if (!item) {
            return res.status(404).send('Product not found!');
        }

        const price = item.selling_price;
        const productName = item.product_name;
        const imgsrc = item.imgsrc;

        // If the user already has a cart
        if (cart) {
            // Check if the product already exists in the cart
            let itemIndex = cart.products.findIndex(p => p.productId == productId);

            // If the product exists, increase the quantity
            if (itemIndex > -1) {
                let productProduct = cart.products[itemIndex]; // Access the existing product in the cart
                productProduct.count += quantity; // Update the quantity of the existing product
                cart.products[itemIndex] = productProduct; // Save the updated product back in the cart
            } else {
                // If the product doesn't exist, add it to the cart
                cart.products.push({ productId, productName, imgsrc, quantity, price });
            }

            // Update the total price of the cart based on the added quantity and price
            cart.cartTotal += quantity * price;
            cart = await cart.save();

            // Add the cart ID to the user's document
            User.findByIdAndUpdate(userId, {
                $push: {
                    cart: cart._id,
                }
            },
                {
                    new: true,
                }
            );

            return res.json({
                success: true,
                message: 'Product added to cart successfully',
                cart
            });
        } else {
            // If no cart exists, create a new cart for the user
            const newCart = await Cart.create({
                orderby: userId,
                products: [{ productId, productName, imgsrc, quantity, price }],
                cartTotal: quantity * price
            });

            // Link the new cart to the user's document
            User.findByIdAndUpdate(userId, {
                $push: {
                    cart: newCart._id,
                }
            },
                {
                    new: true,
                }
            );

            return res.json({
                success: true,
                message: 'Product added to cart successfully',
                newCart
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

// Controller function to delete an item from the cart
exports.delete_item = async (req, res) => {
    try {
        // Extract the user ID and product ID from the request
        const userId = req.user.id;
        const productId = req.params.itemId;

        let cart = await Cart.findOne({ orderby: userId });

        // Find the index of the product to be removed from the cart
        let itemIndex = cart.products.findIndex(p => p._id == productId);

        // If the product exists in the cart, remove it
        if (itemIndex > -1) {
            let productProduct = cart.products[itemIndex];
            cart.bill -= productProduct.quantity * productProduct.price; // Adjust the cart total
            cart.products.splice(itemIndex, 1); // Remove the product from the cart
        }
        cart = await cart.save();
        return res.status(201).json({
            success: true,
            message: 'Product removed from cart successfully',
            cart
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}
