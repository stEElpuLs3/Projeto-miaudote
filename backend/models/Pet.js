const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  especie: { type: String, required: true },
  raca: String,
  idade: Number,
  descricao: String,
  fotos: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);