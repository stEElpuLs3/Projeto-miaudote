// backend/api/login.js
const express = require('express');
const router = express.Router();
const User = require('./usuario'); // importando o model/arquivo usuario.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota POST /api/login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuário não encontrado' });

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Senha incorreta' });

    // Gera token (opcional)
    const token = jwt.sign({ id: user._id }, 'seu_segredo_aqui', { expiresIn: '1h' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

module.exports = router;
