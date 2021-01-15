const Category = require('../models/categoryModel')
const categoryController = {
    getCategories: async(req, res)=>{
        try {
            const categories = await Category.find()
            res.json(categories)
            
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createCategory: async(req, res)=>{
    try {
        const {name} = req.body;
        const category = await Category.findOne({name})
        if(category) return res.status(400).json({msg:"está categoria ja existe"})

        const newCategory = new Category({name})
        await newCategory.save()
        res.json({msg: "categoria criada"})
        
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
    },
    deleteCategory: async(req, res)=>{
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: "deletada a categoria"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateCategory: async(req, res)=>{
        try {

            const {name} = req.body
            await Category.findOneAndUpdate({_id: req.params.id})
            res.json({msg: "categoria atualizada"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}


module.exports = categoryController