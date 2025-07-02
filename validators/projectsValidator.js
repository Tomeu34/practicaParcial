// validators/projectValidator.js
const { check } = require('express-validator');

const projectValidator = [
  check('nombre').notEmpty().withMessage('Nombre del proyecto es obligatorio'),
  check('cliente').notEmpty().isMongoId().withMessage('ID de cliente requerido y válido')
];

module.exports = { projectValidator };
