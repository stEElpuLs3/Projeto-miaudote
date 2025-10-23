import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Slider, 
  Button, 
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const MAX = 100;
const MIN = 1;
const marks = [
  {
    value: MIN,
    label: 'KM',
  },
  {
    value: MAX,
    label: '',
  },
];

function SearchPets() {
  const [raio, setRaio] = useState(MIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pets, setPets] = useState([]);
  const [localizacao, setLocalizacao] = useState(null);

  // Função para obter localização do usuário
  const obterLocalizacao = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada pelo navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalizacao({ lat: latitude, lng: longitude });
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização: ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Usuário negou a solicitação de geolocalização.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Localização indisponível.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Tempo limite da solicitação excedido.';
              break;
            default:
              errorMessage += 'Erro desconhecido.';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  // Função para buscar pets por proximidade
  const buscarPetsProximos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Primeiro obtém a localização
      const coords = await obterLocalizacao();
      
      // Depois busca os pets
      const response = await axios.get('http://localhost:3001/api/pets/proximidade', {
        params: {
          lat: coords.lat,
          lng: coords.lng,
          raio: raio
        }
      });
      
      setPets(response.data);
      console.log('Pets encontrados:', response.data);
      
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (_, newValue) => {
    setRaio(newValue);
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 3,
        py: 4
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Buscar Pets por Região
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom>
        Encontre o pet ideal perto de você
      </Typography>
      
      <Typography variant="body1" align="center" gutterBottom>
        Use a barra de distância para ajustar o raio de busca e encontre pets disponíveis para adoção em sua região
      </Typography>

      {/* Mapa ilustrativo */}
      <Box 
        sx={{
          width: 350,
          height: 200,
          overflow: 'hidden',
          mb: 2,
          borderRadius: 2,
          border: '2px solid #ccc',
        }}
      >
        <Box
          component="img"
          src="https://acontecendoaqui.com.br/wp-content/uploads/2015/11/maps.jpg"
          alt="Mapa ilustrativo"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1 + raio / 320})`,
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Box>

      {/* Controles de busca */}
      <Box sx={{ width: 350, mb: 3 }}>
        <Typography gutterBottom>
          Raio de busca: <strong>{raio} km</strong>
        </Typography>
        <Slider
          marks={marks}
          step={5}
          value={raio}
          valueLabelDisplay="auto"
          min={MIN}
          max={MAX}
          onChange={handleChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            onClick={() => setRaio(MIN)}
            sx={{ cursor: 'pointer' }}
          >
            {MIN} km
          </Typography>
          <Typography
            variant="body2"
            onClick={() => setRaio(MAX)}
            sx={{ cursor: 'pointer' }}
          >
            {MAX} km
          </Typography>
        </Box>
      </Box>

      {/* Botão de busca */}
      <Stack direction="row" spacing={2}>
        <Button 
          variant="contained" 
          onClick={buscarPetsProximos}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Buscando...' : 'Buscar Pets Próximos'}
        </Button>
      </Stack>

      {/* Mensagens de erro */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
          {error}
        </Alert>
      )}

      {/* Localização atual */}
      {localizacao && (
        <Alert severity="info" sx={{ width: '100%', maxWidth: 400 }}>
          Localização: {localizacao.lat.toFixed(4)}, {localizacao.lng.toFixed(4)}
        </Alert>
      )}

      {/* Resultados da busca */}
      {pets.length > 0 && (
        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Pets encontrados ({pets.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {pets.map((pet) => (
              <Box 
                key={pet._id}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  p: 2,
                  width: 200,
                  textAlign: 'center'
                }}
              >
                {pet.fotos && pet.fotos.length > 0 ? (
                  <img 
                    src={pet.fotos[0]} 
                    alt={pet.nome}
                    style={{
                      width: '100%',
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 120,
                      bgcolor: 'grey.100',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="body2" color="grey.500">
                      Sem imagem
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {pet.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pet.especie} • {pet.idade} anos
                </Typography>
                {pet.distancia && (
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    {pet.distancia} km de distância
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {pets.length === 0 && !loading && localizacao && (
        <Alert severity="info" sx={{ width: '100%', maxWidth: 400 }}>
          Nenhum pet encontrado no raio de {raio} km.
        </Alert>
      )}
    </Container>
  );
}

export default SearchPets;