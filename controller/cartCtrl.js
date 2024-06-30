const Cart = require('../models/CartModel');
const Item = require('../models/ProductModel');
const User = require('../models/UserModel');

exports.get_cart_items = async (req,res) => {
    const userId = req.user.id;
    
    try{
        let cart = await Cart.find({orderby:userId}).populate(
            'products.product'
        );
      
        if(cart && cart.length>0){
            res.status(200).json({
                success:true,
                cart
            });
        }
        else{
            res.status(200).json({
                success:true,
                cart:null,
                message:'Your Cart Is Empty'
            });
        }
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}

exports.add_cart_item = async (req,res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({orderby:userId});
        let item = await Item.findOne({_id: productId});
        if(!item){
            res.status(404).send('Item not found!')
        }
        const price = item.selling_price;
        const productName = item.product_name;
      
        const imgsrc = item.imgsrc;

        if(cart){
            // if cart exists for the user
            let itemIndex = cart.products.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex > -1)
            {
                let productItem = cart.products[itemIndex];
                productItem.count += quantity;
                cart.products[itemIndex] = productItem;
            }
            else {
                cart.products.push({ productId, productName , imgsrc, quantity, price });
            }
            cart.cartTotal += quantity*price;
            cart = await cart.save();
           
            return res.json({
                success: true,
                message: 'Product added to cart successfully',
                cart            
            })
        }
        else{
            // no cart exists, create one
            const newCart = await Cart.create({
                orderby:userId,
                products: [{ productId, productName, imgsrc, quantity, price }],
                cartTotal: quantity*price

            })
            User.findByIdAndUpdate(userId, {
                $push: {
                    cart: newCart._id,
                }
            },
                {
                    new: true,
                }
    
            )


            return res.json({
                success: true,
                message: 'Product added to cart successfully',
                newCart
            
            })
        }       
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

exports.delete_item = async (req,res) => {
    const userId = req.user.id;
    const productId = req.params.itemId;
    console.log(productId)
    try{
        let cart = await Cart.findOne({orderby:userId});  
        let itemIndex = cart.products.findIndex(p => p._id == productId);
        console.log(itemIndex)
        if(itemIndex > -1)
        {
            let productItem = cart.products[itemIndex];
            cart.bill -= productItem.quantity*productItem.price;
            cart.products.splice(itemIndex,1);
        }
        cart = await cart.save();
        return res.status(201).json({
            success: true,
            message: 'Item removed from cart successfully',
            cart
        
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}