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
    
    console.log('=== DADOS RECEBIDOS NO CADASTRO ===');
    console.log('Endereço:', { cep, rua, numero, bairro, cidade, estado });
    
    // Construir objeto de endereço
    const enderecoObj = {
      cep: cep || '',
      rua: rua || '',
      numero: numero || '',
      bairro: bairro || '',
      cidade: cidade || '',
      estado: estado || ''
    };

    console.log('Endereço completo:', enderecoObj);

    // Converter endereço para coordenadas
    let coordenadas = null;
    if (enderecoObj.rua && enderecoObj.cidade) {
      try {
        console.log('Chamando geocoding service...');
        coordenadas = await geocodingService.geocodeEndereco(enderecoObj);
        console.log('✅ Geocoding SUCESSO:', coordenadas);
      } catch (geocodeError) {
        console.log('❌ Geocoding ERRO:', geocodeError.message);
      }
    } else {
      console.log('❌ Dados de endereço insuficientes para geocoding');
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

// Rota para editar pet
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { 
      nome, especie, raca, idade, descricao,
      cep, rua, numero, bairro, cidade, estado
    } = req.body;

    // Verifica se o pet existe
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado' });
    }

    // ATENÇÃO: Aqui você deve verificar se o usuário é o dono do pet
    // const user = getUserFromToken(req); // Implementar autenticação
    // if (pet.user.toString() !== user.id) {
    //   return res.status(403).json({ message: 'Acesso negado' });
    // }

    // Construir dados de atualização
    const updateData = {
      nome,
      especie,
      raca,
      idade,
      descricao,
      endereco: {
        cep: cep || '',
        rua: rua || '',
        numero: numero || '',
        bairro: bairro || '',
        cidade: cidade || '',
        estado: estado || ''
      }
    };

    // Processar novas imagens
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => 
        `http://localhost:3001/uploads/${file.filename}`
      );
      updateData.fotos = [...pet.fotos, ...newImageUrls];
    }

    // Atualizar pet
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('user', 'nome email telefone');

    res.json({ 
      message: 'Pet atualizado com sucesso!',
      pet: updatedPet
    });

  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({ message: 'Erro ao atualizar pet', error });
  }
});

module.exports = router;