// backend/api/favoritos.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Adicionar pet aos favoritos
router.post('/:userId/favoritar/:petId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user.favoritos.includes(req.params.petId)) {
      user.favoritos.push(req.params.petId);
      await user.save();
    }
    res.json({ message: 'Pet adicionado aos favoritos', favoritos: user.favoritos });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao favoritar pet', error });
  }
});

// Remover pet dos favoritos
router.delete('/:userId/favoritar/:petId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    user.favoritos = user.favoritos.filter(id => id.toString() !== req.params.petId);
    await user.save();
    res.json({ message: 'Pet removido dos favoritos', favoritos: user.favoritos });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover favorito', error });
  }
});

// Listar favoritos do usuário
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favoritos');
    res.json(user.favoritos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar favoritos', error });
  }
});

module.exports = router;