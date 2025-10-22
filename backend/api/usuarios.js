const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const User = require('../models/User');

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

  console.log('Tentativa de login:', { email }); // ← Log para debug

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado:', email);
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    console.log('Usuário encontrado, verificando senha...');

    // Verifica senha
    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      console.log('Senha incorreta para:', email);
      return res.status(401).json({ message: "Senha incorreta" });
    }

    console.log('Login bem-sucedido para:', email);

    // Geração do token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: "Login realizado com sucesso", 
      token, 
      user: { 
        id: user._id,
        nome: user.nome, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Erro completo no login:', error);
    res.status(500).json({ 
      message: "Erro no login", 
      error: error.message 
    });
  }
});

module.exports = router;
