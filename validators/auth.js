const { check } = require("express-validator")
const validateResults = require("../utils/handleValidators")
const { validationResult } = require("express-validator")

const validatorRegister = [

    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorCode = [

    check("code").exists().notEmpty().isLength({min:6, max:6}),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const validatorLogin = [

    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isLength( {min:8, max: 16} ),
    (req, res, next) => {
        return validateResults(req, res, next)
    }
]

const personalDataValidator = [
  check("nombre").exists().notEmpty().withMessage('Nombre requerido'),
  check("apellidos").exists().notEmpty().withMessage('Apellidos requeridos'),
  check("nif")
    .exists()
    .notEmpty()
    .withMessage('NIF requerido')
    .matches(/^[0-9]{8}[A-Z]$/i)
    .withMessage('NIF inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
]

const companyDataValidator = [
  check('nombre').isString().notEmpty().withMessage('Nombre de empresa requerido'),
  check('cif')
    .isString()
    .notEmpty()
    .withMessage('CIF requerido')
    .matches(/^[A-Z][0-9]{8}$/i)
    .withMessage('CIF inválido'),
  check('direccion').isString().notEmpty().withMessage('Dirección requerida'),
  check('isAutonomo').optional().isBoolean(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
]

module.exports = { validatorRegister, validatorCode, validatorLogin, personalDataValidator, companyDataValidator }