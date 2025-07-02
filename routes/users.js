const express = require("express")
const router = express.Router()
const {verifyToken} = require("../utils/handleJwt")
const {validatorRegister, validatorCode, validatorLogin, personalDataValidator, companyDataValidator} = require("../validators/auth")

const { registerUser, validateUser, login, logo, onBoardingUser, onBoardingCompany, getUser, deleteUser} = require("../controllers/users")

router.post("/register", validatorRegister, registerUser)
router.post("/validate", verifyToken, validatorCode, validateUser)
router.post("/login", validatorLogin, login)
router.post("/logo", logo)
router.put('/register', verifyToken, personalDataValidator, onBoardingUser)
router.patch('/company', verifyToken, companyDataValidator, onBoardingCompany)
router.delete('/user', verifyToken, deleteUser)
router.get("/me", verifyToken, getUser)

module.exports = router