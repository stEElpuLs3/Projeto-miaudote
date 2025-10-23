const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  especie: { type: String, required: true },
  raca: String,
  idade: Number,
  descricao: String,
  fotos: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // ADICIONE ESTES CAMPOS:
  endereco: {
    cep: String,
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    estado: String
  },
  localizacao: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  status: { 
    type: String, 
    enum: ['disponivel', 'adotado'],
    default: 'disponivel'
  }
}, { timestamps: true });

// Adicione índice para busca por proximidade
PetSchema.index({ localizacao: '2dsphere' });

module.exports = mongoose.model('Pet', PetSchema);