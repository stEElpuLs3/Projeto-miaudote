// backend/api/mensagens.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Mensagem = require('../models/Mensagem');
const emailService = require('../services/emailService');
const User = require('./usuarios').User; // Ajuste conforme seu arquivo

// Enviar mensagem
router.post('/', async (req, res) => {
  try {
    const { remetente, destinatario, pet, mensagem, tipo } = req.body;

    const novaMensagem = new Mensagem({
      remetente,
      destinatario,
      pet,
      mensagem,
      tipo
    });

    await novaMensagem.save();
    
    // Popula os dados para retornar
    const mensagemPopulada = await Mensagem.findById(novaMensagem._id)
      .populate('remetente', 'nome email avatar')
      .populate('destinatario', 'nome email')
      .populate('pet', 'nome fotos');

    // Enviar email de notificação
    try {
      const destinatarioData = await User.findById(destinatario);
      const remetenteData = await User.findById(remetente);
      const petData = await Pet.findById(pet);

      await emailService.enviarEmailNovaMensagem(
        destinatarioData, 
        remetenteData, 
        petData
      );
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não falha a requisição se o email falhar
    }

    res.status(201).json({ 
      message: 'Mensagem enviada com sucesso!', 
      mensagem: mensagemPopulada 
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ message: 'Erro ao enviar mensagem', error });
  }
}); 

// Buscar mensagens de um usuário
router.get('/usuario/:userId', async (req, res) => {
  try {
    const mensagens = await Mensagem.find({
      $or: [
        { remetente: req.params.userId },
        { destinatario: req.params.userId }
      ]
    })
    .populate('remetente', 'nome email avatar')
    .populate('destinatario', 'nome email avatar')
    .populate('pet', 'nome fotos')
    .sort({ createdAt: -1 });

    res.json(mensagens);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar mensagens', error });
  }
});

// Marcar mensagem como lida
router.put('/:id/lida', async (req, res) => {
  try {
    await Mensagem.findByIdAndUpdate(req.params.id, { lida: true });
    res.json({ message: 'Mensagem marcada como lida' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar mensagem', error });
  }
});

module.exports = router;