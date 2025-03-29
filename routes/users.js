const express = require("express")
const router = express.Router()
const {validatorRegister, validatorCode, validatorLogin} = require("../validators/auth") //, validatorLogin

const { registerUser, validateUser, login, logo } = require("../controllers/users")

router.post("/register", validatorRegister, registerUser)
router.post("/validate/:token", validatorCode, validateUser)
router.post("/login", validatorLogin, login)
router.post("/logo", logo)

module.exports = router