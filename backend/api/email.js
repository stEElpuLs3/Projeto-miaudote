// backend/api/email.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const emailService = require('../services/emailService');

// Ajuste os caminhos conforme seus models
const User = mongoose.model('User'); // Ou: const User = require('./usuarios').User;
const Pet = require('../models/Pet');

// Rota para enviar email de interesse
router.post('/interesse', async (req, res) => {
  try {
    const { petId, interessadoId } = req.body;
    
    console.log('📧 Recebida solicitação de email de interesse:', { petId, interessadoId });

    // Buscar dados no banco
    const pet = await Pet.findById(petId);
    const interessado = await User.findById(interessadoId);
    const donoPet = await User.findById(pet.user);

    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado' });
    }
    if (!interessado) {
      return res.status(404).json({ message: 'Usuário interessado não encontrado' });
    }
    if (!donoPet) {
      return res.status(404).json({ message: 'Dono do pet não encontrado' });
    }

    console.log('📨 Enviando email para:', donoPet.email);
    
    // Enviar email
    await emailService.enviarEmailInteresse(donoPet, interessado, pet);
    
    res.json({ 
      message: 'Notificação de interesse enviada com sucesso!',
      enviadoPara: donoPet.email
    });
    
  } catch (error) {
    console.error('❌ Erro ao enviar email de interesse:', error);
    res.status(500).json({ 
      message: 'Erro ao enviar notificação', 
      error: error.message 
    });
  }
});

module.exports = router;