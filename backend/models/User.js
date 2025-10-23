// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  avatar: String,
  redeSocial: {
    plataforma: String,
    usuario: String
  },
  endereco: {
    cep: String,
    rua: String,
    numero: String,
    cidade: String,
    estado: String
  },
  sobre: String,
  historico: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);