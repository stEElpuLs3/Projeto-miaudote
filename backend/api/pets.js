const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const upload = require('../middleware/upload'); // Importar multer
const geocodingService = require('../services/geocodingService'); 

const Pet = require('../models/Pet');

// Rota de cadastro com geolocalização - CORRIGIDA
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const { nome, especie, raca, idade, descricao, user, cep, rua, numero, bairro, cidade, estado } = req.body;
    
    // Construir objeto de endereço a partir dos campos individuais
    const enderecoObj = {
      cep: cep || '',
      rua: rua || '',
      numero: numero || '',
      bairro: bairro || '',
      cidade: cidade || '',
      estado: estado || ''
    };

    // Converter endereço para coordenadas
    let coordenadas = null;
    if (enderecoObj.rua && enderecoObj.cidade) {
      try {
        coordenadas = await geocodingService.geocodeEndereco(enderecoObj);
      } catch (geocodeError) {
        console.log('Erro no geocoding, continuando sem coordenadas:', geocodeError);
        // Continua sem coordenadas, não quebra o cadastro
      }
    }

    // Pegar URLs das imagens
    const imageUrls = req.files ? req.files.map(file => 
      `http://localhost:3001/uploads/${file.filename}`
    ) : [];

    const newPet = new Pet({
      nome,
      especie,
      raca,
      idade: idade || 0,
      descricao: descricao || '',
      user,
      fotos: imageUrls,
      endereco: enderecoObj,
      localizacao: coordenadas ? {
        type: 'Point',
        coordinates: [coordenadas.lng, coordenadas.lat]
      } : null
    });

    await newPet.save();
    res.status(201).json({ message: 'Pet cadastrado com sucesso!', pet: newPet });
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error);
    res.status(500).json({ message: 'Erro ao cadastrar pet', error: error.message });
  }
});

// NOVA ROTA: Buscar pets por proximidade
router.get('/proximidade', async (req, res) => {
  try {
    const { lat, lng, raio = 10 } = req.query; // raio em km
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Coordenadas são obrigatórias' });
    }

    const pets = await Pet.find({
      localizacao: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: raio * 1000 // converter km para metros
        }
      },
      status: 'disponivel'
    }).populate('user', 'nome email telefone');

    // Calcular distância para cada pet
    const petsComDistancia = pets.map(pet => {
      const distancia = geocodingService.calcularDistancia(
        parseFloat(lat),
        parseFloat(lng),
        pet.localizacao.coordinates[1],
        pet.localizacao.coordinates[0]
      );
      
      return {
        ...pet.toObject(),
        distancia: Math.round(distancia * 10) / 10 // 1 casa decimal
      };
    });

    res.json(petsComDistancia);
  } catch (error) {
    console.error('Erro ao buscar pets por proximidade:', error);
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

    await Pet.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Pet deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({ message: 'Erro ao deletar pet', error });
  }
});

// Rota para buscar todos os pets 
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find()
      .populate('user', 'nome email telefone')
      .sort({ createdAt: -1 }); // Mais recentes primeiro
    
    res.json(pets);
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({ message: 'Erro ao buscar pets', error });
  }
});

module.exports = router;