const { matchedData } = require("express-validator")
const { encrypt, compare } = require("../utils/handlePassword")
const {usersModel} = require("../models")
const {tokenSign} = require("../utils/handleJwt")

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

    res.json(data)
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

const login = async (req, res) => {
    
    user = await usersModel.find({"email": req.body.email})

    if(user[0] == undefined){

        console.log("ERROR: Usuario no encontrado")

    } else {

        if(user[0].userState == "pending"){

            console.log("ERROR: Usuario no validado")

        } else {

            if(compare(req.body.password, user[0].password)){

                console.log("Login exitoso")
                res.send(user)

            } else {

                console.log("ERROR: Contraseña incorrecta")
            }
        }
    }
}

const logo = async (req, res) => {


}

const onBoardingUser = async (req, res) => {
  try {
    const { nombre, apellidos, nif } = req.body;

    const user = await usersModel.findByIdAndUpdate(
      req.user._id,
      { nombre, apellidos, nif },
      { new: true, runValidators: true }
    ).select('-password -verificationCode');

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.status(200).json({ message: 'Datos personales actualizados', user });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
}

const onBoardingCompany = async (req, res) => {
  try {
    const { nombre, cif, direccion, isAutonomo } = req.body;

    const user = await usersModel.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (isAutonomo) {
      // Copiar sus datos personales como empresa
      user.company = {
        nombre: user.nombre,
        cif: user.nif,
        direccion,
        isAutonomo: true,
      };
    } else {
      user.company = {
        nombre,
        cif,
        direccion,
        isAutonomo: false,
      };
    }

    await user.save();

    res.status(200).json({ message: 'Datos de compañía actualizados', company: user.company });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const getUser = async (req, res) => {

    try {
        console.log(req.user)
        const userId = req.user._id;

        const user = await usersModel.findById(userId).select('-password -verificationCode');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            email: user.email,
            status: user.status,
            role: user.role,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

const deleteUser = async (req, res) => {
  const userId = req.user._id;
  const isSoftDelete = req.query.soft !== 'false'; // true si soft, false si hard

  try {
    const user = await usersModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (isSoftDelete) {
      user.deleted = true;
      await user.save();
      return res.status(200).json({ message: 'Usuario eliminado (soft delete)' });
    } else {
      await usersModel.findByIdAndDelete(userId);
      return res.status(200).json({ message: 'Usuario eliminado permanentemente (hard delete)' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

module.exports = { registerUser, validateUser, login, logo, onBoardingUser, getUser, onBoardingCompany, deleteUser }