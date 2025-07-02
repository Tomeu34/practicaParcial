const {deliveryNoteModel} = require('../models');
const {projectsModel} = require('../models');
const {clientsModel} = require('../models');
const {usersModel} = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const  uploadToPinata  = require('../utils/handleUploadIPFS');

const createDeliveryNote = async (req, res) => {
  try {
    const { proyecto, cliente, horas, materiales } = req.body;
    const userId = req.user._id;
    
    const project = await projectsModel.findById(proyecto);
    const client = await clientsModel.findById(cliente);
    if (!project || !client) return res.status(404).json({ error: 'Proyecto o cliente no encontrado' });

    const note = new deliveryNoteModel({
      proyecto,
      cliente,
      creadoPor: userId,
      horas: horas || [],
      materiales: materiales || []
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno al crear albarán' });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await deliveryNoteModel.find({
      creadoPor: req.user._id,
      deleted: false
    }).populate('proyecto cliente creadoPor');

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
};

const getOneNote = async (req, res) => {
  try {
    const note = await deliveryNoteModel.findOne({
      _id: req.params.id,
      creadoPor: req.user._id,
      deleted: false
    }).populate('proyecto cliente creadoPor horas.persona');

    if (!note) return res.status(404).json({ error: 'Albarán no encontrado' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
};

const generatePdf = async (req, res) => {
  try {
    const note = await deliveryNoteModel.findOne({
      _id: req.params.id,
      creadoPor: req.user._id
    }).populate('proyecto cliente creadoPor horas.persona');

    if (!note) return res.status(404).json({ error: 'Albarán no encontrado' });

    // Si ya hay PDF en la nube
    if (note.pdfUrl) return res.redirect(note.pdfUrl);

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `../tmp/albaran-${note._id}.pdf`);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text('Albarán', { align: 'center' }).moveDown();
    doc.fontSize(14);
    doc.text(`Proyecto: ${note.proyecto.nombre}`);
    doc.text(`Cliente: ${note.cliente.nombre}`);
    doc.text(`Creado por: ${note.creadoPor.email}`);
    doc.text(`Fecha: ${note.fecha.toLocaleDateString()}`);
    doc.moveDown();

    if (note.horas.length > 0) {
      doc.text('Horas:');
      note.horas.forEach(h => {
        doc.text(`- ${h.persona?.email || 'Usuario desconocido'}: ${h.horas}h (${h.descripcion || ''})`);
      });
      doc.moveDown();
    }

    if (note.materiales.length > 0) {
      doc.text('Materiales:');
      note.materiales.forEach(m => {
        doc.text(`- ${m.nombre}: ${m.cantidad} ${m.unidad || ''} (${m.descripcion || ''})`);
      });
    }

    if (note.firmado && note.firmaUrl) {
      doc.moveDown().text('Firmado ✅');
    }

    doc.end();

    stream.on('finish', () => {
      res.download(filePath, `albaran-${note._id}.pdf`, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar PDF' });
  }
};

const uploadSignature = async (req, res) => {
  try {
    const note = await deliveryNoteModel.findOne({
      _id: req.params.id,
      creadoPor: req.user._id
    });

    if (!note) return res.status(404).json({ error: 'Albarán no encontrado' });
    if (!req.file) return res.status(400).json({ error: 'Archivo de firma requerido' });

    // const { url } = await uploadToCloud(req.file.buffer);

    note.firmado = true;
    note.firmaUrl = fakeUrl;

    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      const pdfUrl = `https://fake-cloud.com/pdf-${note._id}.pdf`;
      // const pdfUpload = await uploadToCloud(pdfBuffer);
      note.pdfUrl = pdfUrl;
      await note.save();
      res.json({ message: 'Albarán firmado y PDF generado', firmaUrl: fakeUrl, pdfUrl });
    });

    doc.text('PDF con firma');
    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Error al firmar albarán' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await deliveryNoteModel.findOne({
      _id: req.params.id,
      creadoPor: req.user._id
    });

    if (!note) return res.status(404).json({ error: 'Albarán no encontrado' });
    if (note.firmado) return res.status(403).json({ error: 'No se puede borrar un albarán firmado' });

    note.deleted = true;
    await note.save();
    res.json({ message: 'Albarán eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al borrar albarán' });
  }
};

module.exports = {
  createDeliveryNote,
  getAllNotes,
  getOneNote,
  generatePdf,
  uploadSignature,
  deleteNote
};
