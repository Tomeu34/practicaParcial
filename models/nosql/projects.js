const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    descripcion: { 
        type: String 
    },
  
    cliente: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Client', required: true 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, // opcional

    deleted: { 
        type: Boolean, 
        default: false 
    },
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
