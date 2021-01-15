const router = require('express').Router()
const setorController = require('../controllers/setorControllers')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/setor')
.get(setorController.getSetor)
.post(auth, authAdmin, setorController.createSetor)

router.route('/category/:id')
.delete(auth, authAdmin, setorController.deleteSetor )
.put(auth, authAdmin, setorController.updateSetor )


module.exports = router