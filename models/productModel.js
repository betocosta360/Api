const mongoose = require('mongoose')


const produtcSchema = new mongoose.Schema({


    product_id: {
        type: String,
        trim: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    serial: {
        type: Number,
        unique: true,
        trim: true,
        required: true
    },
    patrimonio: {
        type: Number,
        unique: true,
        trim: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        default: 0
    },
    setor: {
        type: String,
        trim: true,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    descricao: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
    

},
{
    timestamps: true
},

)

module.exports = mongoose.model("Products", produtcSchema)