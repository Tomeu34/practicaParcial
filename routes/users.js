const express = require("express")
const router = express.Router()
const {validatorRegister, validatorCode, validatorLogin} = require("../validators/auth") //, validatorLogin

const { registerUser, validateUser } = require("../controllers/users")

router.post("/register", validatorRegister, registerUser)
router.post("/validate", validatorCode, validateUser)

module.exports = router