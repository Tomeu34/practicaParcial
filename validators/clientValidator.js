const { check } = require('express-validator');
const { validationResult } = require("express-validator")

const clientValidator = [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('email').optional().isEmail().withMessage('Email inválido'),
  check('telefono').optional().isMobilePhone('any').withMessage('Teléfono inválido'),
];

module.exports = { clientValidator };
