// backend/api/usuarios.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const router = express.Router();

// Schema do usuário
const UserSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  email: String,
  senha: String,
  historico: { type: Array, default: [] }
});

// ⚡ Prevenção OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Função de conexão com o MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// Rota para criar usuário
router.post('/', async (req, res) => {
  await connectDB();
  try {
    const novoUser = new User(req.body);
    await novoUser.save();
    res.status(201).json({ mensagem: 'Usuário criado!', user: novoUser });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar usuário', erro: error.message });
  }
});

// Rota para listar usuários
router.get('/', async (req, res) => {
  await connectDB();
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuários', erro: error.message });
  }
});

router.post('/login', async (req, res) => {
  await connectDB();
  const { email, senha } = req.body;
  const user = await User.findOne({ email, senha });
  if (user) {
    res.status(200).json({ mensagem: 'Login sucesso!', user });
  } else {
    res.status(401).json({ mensagem: 'Usuário ou senha incorreto' });
  }
});

module.exports = router;
