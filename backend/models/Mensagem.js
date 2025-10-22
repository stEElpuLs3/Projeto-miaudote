// backend/models/Mensagem.js
const mongoose = require('mongoose');

const MensagemSchema = new mongoose.Schema({
  remetente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  destinatario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet' 
  },
  mensagem: { 
    type: String, 
    required: true 
  },
  lida: { 
    type: Boolean, 
    default: false 
  },
  tipo: {
    type: String,
    enum: ['interesse', 'pergunta', 'resposta'],
    default: 'interesse'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Mensagem', MensagemSchema);