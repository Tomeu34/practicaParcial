const express = require('express');
const router = express.Router();
const {verifyToken} = require("../utils/handleJwt")
const { clientValidator } = require('../validators/clientValidator');
const ctrl = require('../controllers/client');

router.use(verifyToken); // todas las rutas requieren JWT

router.post('/', clientValidator, ctrl.createClient);
router.put('/:id', clientValidator, ctrl.updateClient);
router.get('/', ctrl.getAllClients);
router.get('/archived', ctrl.getArchivedClients);
router.get('/:id', ctrl.getOneClient);
router.patch('/:id/restore', ctrl.restoreClient);
router.delete('/:id', ctrl.deleteClient);

module.exports = router;
