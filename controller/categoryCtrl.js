const Category = require('../models/CategoryModel');

exports.createCategory = async(req,res)=>{
    try{
        const {name,description} = req.body;
        const category = await Category.create({
            name,
            description
        });
        res.status(200).json({message:"Category created successfully"});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

exports.updateCategory = async(req,res)=>{
    try{
        const {name,description,id} = req.body;
        const category = await Category.findByIdAndUpdate(id,{
            name,
            description
        },{
            new:true,
            runValidators:true
        });
        res.status(200).json({message:"Category updated successfully"});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}

exports.deleteCategory = async(req,res)=>{
    try{
        const {id} = req.params;
        const category = await Category.findByIdAndDelete(id);
        res.status(200).json({message:"Category deleted successfully"});
    }
    catch(err){
        res.status(400).json({message:err.message});
    }
}


exports.categoryProducts = async(req,res)=>{
    try{
        const {category_id} = req.body;
        const category = await Category.findById(category_id).populate({
            path:'products',
            select:'product_name desc selling_price market_price imgsrc imghoversrc avgRating'
        }).exec();

        if(!category){
            res.status(400).json({
                success:false,
                message:'Category Not Found'
            })
        }

        //get all products in the category
        const products = category.products;
        res.status(200).json({
            success:true,
            products
        });

    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

exports.topSellingProducts = async(req,res)=>{
    try {
        //top 5 products with the highest average rating
        const products = await Category.find().populate({
            path:'products',
            select:'product_name desc selling_price market_price imgsrc imghoversrc avgRating',
            options:{limit:5,sort:{avgRating:-1}}
        }).exec();

        res.status(200).json({
            success:true,
            products
        });
        
    } catch (error) {
        res.status(400).json({
            success:true,
            message:error.message
        })
    }
}