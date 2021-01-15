const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email })
            if (user) return res.status(400).json({ msg: "o email ja existe" })
            if (password.length < 6)
                return res.status(400).json({ msg: "senha deve conter no minimo 6 digitos" })

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name, email, password: passwordHash
            })

            await newUser.save()

            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            // res.json({msg: "Registrado com sucesso!"})
            res.json({ accesstoken })



        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    login: async (req, res)=>{
        try {
            const {email, password}= req.body;
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "usuario não existe"})

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) return res.status(400).json({msg: "senha incorreta"})

            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })
            // res.json({msg: "Registrado com sucesso!"})
            res.json({ accesstoken })
            
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    logout: async (req, res)=>{
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'} )
            return res.json({msg: "saiu do sistema"})
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "por favor faça login ou registre-se" })
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
                if (error) return res.status(400).json({ msg: "por favor faça login ou registre-se" })
                const accesstoken = createAccessToken({ id: user.id })
                res.json({ user, accesstoken })
            })

            //res.json({rf_token})

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }

    },
    getUser: async (req, res)=>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({ msg: "usuario inexistente" })

            res.json(user)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userController