const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const upload = require('../middleware/upload'); // Importar multer

const Pet = require('../models/Pet');

router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { nome, especie, raca, idade, descricao, user } = req.body;
    
    // Pegar URLs das imagens enviadas
    const imageUrls = req.files ? req.files.map(file => 
      `http://localhost:3001/uploads/${file.filename}`
    ) : [];

    const newPet = new Pet({
      nome,
      especie,
      raca,
      idade,
      descricao,
      user,
      fotos: imageUrls
    });

    await newPet.save();
    res.status(201).json({ message: 'Pet cadastrado com sucesso!', pet: newPet });
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error);
    res.status(500).json({ message: 'Erro ao cadastrar pet', error });
  }
});

// Listar todos pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find().populate('user', 'nome email telefone');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pets', error });
  }
});

// Pets de um usuário específico
router.get('/user/:userId', async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.params.userId });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pets do usuário', error });
  }
});

// Rota para deletar pet
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado' });
    }

    // TODO: Verificar se o usuário é o dono do pet
    // const user = getUserFromToken(req); // Implementar autenticação
    
    // Deletar imagens do sistema de arquivos (opcional)
    // if (pet.fotos && pet.fotos.length > 0) {
    //   pet.fotos.forEach(foto => {
    //     const filename = foto.split('/').pop();
    //     fs.unlinkSync(`uploads/${filename}`);
    //   });
    // }

    await Pet.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Pet deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({ message: 'Erro ao deletar pet', error });
  }
});

module.exports = router;