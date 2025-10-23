// backend/services/geocodingService.js
const axios = require('axios');

class GeocodingService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  }

  // Converter endereço em coordenadas
  async geocodeEndereco(endereco) {
    try {
      const { rua, numero, cidade, estado, cep } = endereco;
      const enderecoCompleto = `${rua} ${numero}, ${cidade}, ${estado}, ${cep}, Brasil`;
      
      const response = await axios.get(this.baseUrl, {
        params: {
          address: enderecoCompleto,
          key: this.apiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      } else {
        throw new Error('Endereço não encontrado: ' + response.data.status);
      }
    } catch (error) {
      console.error('Erro no geocoding:', error);
      throw error;
    }
  }

  // Calcular distância entre dois pontos (em km)
  calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distancia = R * c;
    return distancia;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}

module.exports = new GeocodingService();