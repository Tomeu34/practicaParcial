const express = require("express")
const router = express.Router()
const {validatorRegister} = require("../validators/auth") //, validatorLogin

const { registerUser, validateUser } = require("../controllers/users")

router.post("/register", validatorRegister, registerUser)
router.post("/validate", validateUser)

module.exports = router