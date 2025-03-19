const express = require("express")
const router = express.Router()
const {validatorRegister, validatorCode, validatorLogin} = require("../validators/auth") //, validatorLogin

const { registerUser, validateUser, login } = require("../controllers/users")

router.post("/register", validatorRegister, registerUser)
router.post("/validate", validatorCode, validateUser)
router.post("/login", validatorLogin, login)

module.exports = router