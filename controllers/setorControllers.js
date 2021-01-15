const Setor = require('../models/setorModels')
const setorController = {
    getSetor: async (req, res) => {
        try {
            const setores = await Setor.find()
            res.json(setores)

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    createSetor: async(req, res)=>{
        try {
            const {name} = req.body;
            const setor = await Setor.findOne({name})
            if(setor) return res.status(400).json({msg:"este Setor ja existe"})
    
            const newSetor = new Setor({name})
            await newSetor.save()
            res.json({msg: "Setor criado"})
            
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
        },
    deleteSetor: async(req, res)=>{
        try {
            await Setor.findByIdAndDelete(req.params.id)
            res.json({msg: "deletada o Setor"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateSetor: async(req, res)=>{
        try {

            const {name} = req.body
            await Setor.findOneAndUpdate({_id: req.params.id})
            res.json({msg: "Setor atualizado"})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}


module.exports = setorController