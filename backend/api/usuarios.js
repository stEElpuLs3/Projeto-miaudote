const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Schema do usuário
const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  historico: { type: Array, default: [] }
});

const User = mongoose.model('User', UserSchema);

// Rota de cadastro
router.post('/register', async (req, res) => {
  const { nome, telefone, email, senha } = req.body;

  try {
    // Verifica se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Usuário já existe" });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criação do usuário
    const newUser = new User({ nome, telefone, email, senha: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Verifica senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return res.status(401).json({ message: "Senha incorreta" });

    // Geração do token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: "Login realizado com sucesso", token, user: { nome: user.nome, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Erro no login", error });
  }
});

module.exports = router;
