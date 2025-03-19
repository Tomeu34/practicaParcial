const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")
const {usersModel} = require("../models")
const {tokenSign, verifyToken} = require("../utils/handleJwt")

const registerUser = async (req, res) => {
    req = matchedData(req)
    const password = await encrypt(req.password)
    const valCode = Math. floor(Math. random() * (999999 - 100000 + 1)) + 100000
    const body = {...req, password, valCode} // Con "..." duplicamos el objeto y le añadimos o sobreescribimos una propiedad
    const dataUser = await usersModel.create(body)

    const data = {
        token: await tokenSign(dataUser),
        user: dataUser
    }

    console.log("Enviando código de verificación al correo. Código: ", valCode)

    res.send(data)
}

const validateUser = async (req, res) => {

    var user = await usersModel.find({"email": req.body.user})

    if(user[0].userState == "Validated"){

        console.log("Usuario ya validado")

    } else {

        if(user[0].valCode == req.body.code){
            
            console.log("Hola")
            await usersModel.updateOne({ email: req.body.user}, { $set: {userState : "Validated"} });
        }

        user = await usersModel.find({"email": req.body.user})
    }

    res.send(user)
}

//TODO router.post("/login", (req, res) => {}
module.exports = { registerUser, validateUser }