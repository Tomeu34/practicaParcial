const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String 
    },
    telefono: { 
        type: String 
    },
    direccion: { 
        type: String 
    },

    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, // si el user tiene empresa asociada

    deleted: { type: Boolean, default: false }, // Soft delete
}, {
    timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
