const mongoose = require('mongoose');

const hourEntrySchema = new mongoose.Schema({
  persona: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  horas: { type: Number, required: true },
  descripcion: String
});

const materialEntrySchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  unidad: { type: String }, // ej: kg, m2
  descripcion: String
});

const deliveryNoteSchema = new mongoose.Schema({
  proyecto: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },

  horas: [hourEntrySchema],
  materiales: [materialEntrySchema],

  firmado: { type: Boolean, default: false },
  firmaUrl: { type: String },
  pdfUrl: { type: String }, // si está subido a la nube

  deleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryNote', deliveryNoteSchema);
