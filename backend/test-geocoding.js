require('dotenv').config();
const geocodingService = require('./services/geocodingService');

async function test() {
  try {
    const endereco = {
      rua: 'Avenida Paulista',
      numero: '1000',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01310-100'
    };
    
    const coordenadas = await geocodingService.geocodeEndereco(endereco);
    console.log('✅ Geocoding funcionando!');
    console.log('Coordenadas:', coordenadas);
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

test();