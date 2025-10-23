const axios = require('axios');

class GeocodingService {
  constructor() {
    this.nominatimUrl = 'https://nominatim.openstreetmap.org/search';
  }

  // Converter endereço em coordenadas usando OpenStreetMap (GRATUITO)
  async geocodeEndereco(endereco) {
    try {
      const { rua, numero, cidade, estado, cep } = endereco;
      const enderecoCompleto = `${rua} ${numero}, ${cidade}, ${estado}, Brasil`;
      
      console.log('🟡 Buscando coordenadas no OpenStreetMap para:', enderecoCompleto);

      const response = await axios.get(this.nominatimUrl, {
        params: {
          q: enderecoCompleto,
          format: 'json',
          limit: 1,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'MiaudoteApp/1.0 (vitor@miaudote.com)'
        }
      });

      console.log('🔵 Resposta OpenStreetMap:', response.data);

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        console.log('✅ Coordenadas encontradas:', location.lat, location.lon);
        return {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon)
        };
      } else {
        console.log('❌ Endereço não encontrado no OpenStreetMap');
        // Fallback: retorna coordenadas aproximadas da cidade
        return this.getCoordenadasAproximadas(cidade, estado);
      }
    } catch (error) {
      console.error('🔴 Erro no geocoding OpenStreetMap:', error);
      // Fallback em caso de erro
      return this.getCoordenadasAproximadas(endereco.cidade, endereco.estado);
    }
  }

  // Fallback para coordenadas aproximadas da cidade
  getCoordenadasAproximadas(cidade, estado) {
    const coordenadasCidades = {
      'São Paulo': { lat: -23.5505, lng: -46.6333 },
      'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
      'Belo Horizonte': { lat: -19.9167, lng: -43.9345 },
      'Salvador': { lat: -12.9714, lng: -38.5014 },
      'Fortaleza': { lat: -3.7319, lng: -38.5267 },
      'Brasília': { lat: -15.7942, lng: -47.8822 },
      'Curitiba': { lat: -25.4284, lng: -49.2733 },
      'Manaus': { lat: -3.1190, lng: -60.0217 },
      'Cariacica': { lat: -20.2637, lng: -40.3989 },
      'Vitória': { lat: -20.3155, lng: -40.3128 },
      'Vila Velha': { lat: -20.3297, lng: -40.2922 },
      'Serra': { lat: -20.1286, lng: -40.3078 }
    };

    const chave = cidade in coordenadasCidades ? cidade : 'São Paulo';
    console.log(`📍 Usando coordenadas aproximadas de: ${chave}`);
    return coordenadasCidades[chave];
  }

  // Calcular distância entre dois pontos (em km) - MANTIDO
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