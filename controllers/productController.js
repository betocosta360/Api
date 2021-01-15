const Products = require('../models/productModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        const excludedFields = ['page', 'sort', 'limit']

        excludedFields.forEach(el => delete(queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        this.query.find(JSON.parse(queryStr))
        return thtis
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createAt')
        }
        return this
    }

    paginating(){
        const psge = tthis.queryString.page * 1|| 1
        const limit = this.queryString.limit * 1|| 9
        const skip = (page -1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this

    }
}

const productController = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting()
            const products = await features.query

            res.json({
                status: 'success',
                resultt: product.length,
                products: products
            })

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, descricao, serial, patrimonio, quantidade, setor, images, category, content } = req.body

            if (!images) return res.status(400).json({ msg: "nenhuma imagem enviada" })

            const product = await Products.findOne({ product_id })
            if (product) return res.status(400).json({ msg: "esse produto ja existe" })

            const newProduct = new Products({
                product_id, title, descricao, serial, patrimonio, quantidade, setor, images, category, content
            })
            await newProduct.save()
            res.json({ msg: "produto criado com sucesso" })

        } catch (error) {
            return res.status(500).json({ msg: error.message })

        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ msg: "produto deletado" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { product_id, title, descricao, serial, patrimonio, quantidade, setor, images, category, content } = req.body
            if (!images) return res.status(400).json({ msg: "nenhuma imagem enviada" })

            await Products.findOneAndUpdate({ _id: req.params.id }, {
                product_id, title, descricao, serial, patrimonio, quantidade, setor, images, category, content
            })
            res.json({msg: "produto atualizado"})
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}


module.exports = productController