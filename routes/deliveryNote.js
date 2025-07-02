const express = require('express');
const router = express.Router();
const {verifyToken} = require("../utils/handleJwt")
const {uploadMiddleware} = require("../utils/handleStorage")

const ctrl = require('../controllers/deliveryNote');

router.use(verifyToken);

router.post('/', ctrl.createDeliveryNote);
router.get('/', ctrl.getAllNotes);
router.get('/:id', ctrl.getOneNote);
router.get('/pdf/:id', ctrl.generatePdf);
router.post('/:id/sign', uploadMiddleware.single('firma'), ctrl.uploadSignature);
router.delete('/:id', ctrl.deleteNote);

module.exports = router;
