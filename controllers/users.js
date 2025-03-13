const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")
const {usersModel} = require("../models")
const {validatorRegister} = require("../validators/auth") //, validatorLogin
const {tokenSign, verifyToken} = require("../utils/handleJwt")

// Posteriormente, llevaremos la lógica al controller
const registerUser = async (req, res) => {
    //const req1 = matchedData(req)
    const password = await encrypt(req.body.password)
    const valCode = Math. floor(Math. random() * (999999 - 100000 + 1)) + 100000
    const body = {...req.body, password, valCode} // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await usersModel.create(body)
    //dataUser.set('password', undefined, { strict: false })

    const data = {
        token: await tokenSign(dataUser),
        user: dataUser
    }

    console.log("Enviando código de verificación al correo. Código: ", valCode)

    res.send(data)
}

//TODO router.post("/login", (req, res) => {}
module.exports = {registerUser}