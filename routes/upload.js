const router = require('express').Router()
const cloudinary = require('cloudinary')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


router.post('/upload',  (req, res) => {
    try {
        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)

            return res.status(400).json({ msg: 'não foi feito upload de nenhum arquivo' })

        const file = req.files.file

        if (file.size > 1024 * 1024) {

            removeTmp(file.tempFilePath)

            return res.status(400).json({ msg: 'a imagem é muito grande' })
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {

            removeTmp(file.tempFilePath)

            return res.status(400).json({ msg: "arquivo em formato invalido" })
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "impressoras" }, async (error, result) => {
            if (error) throw error

            removeTmp(file.tempFilePath)

            res.json({ public_id: result.public_id, url: result.secure_url })
        })


    } catch (error) {
       return res.status(500).json({ msg: error.message })
    }
}),

router.post('/destroy',  (req, res) =>{
try {
    const {public_id} = req.body
    if(!public_id) return res.status(400).json({msg: 'nenhuma imagem selecionada'})

    cloudinary.v2.uploader.destroy(public_id, async (error, result) =>{

        if(error) throw error
        res.json({msg: "imagem deletada"})
    })
    
} catch (error) {
    res.status(500).json({msg: error.message})
}
})

const removeTmp = (path) => {
    fs.unlink(path, error => {
        if (error) throw error
    })
}

module.exports = router