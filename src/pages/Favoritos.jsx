import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import { useNavigate } from 'react-router-dom';
import PetCard from '../components/PetCard/PetCard';
import axios from 'axios';

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchFavoritos = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/favoritos/${user.id}`);
      setFavoritos(response.data);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFavoritos();
    } else {
      setLoading(false);
    }
  }, [user, fetchFavoritos]);

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <FavoriteIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Acesso Restrito
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Faça login para ver seus pets favoritos
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
        >
          Fazer Login
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <Typography variant="h6">Carregando seus favoritos...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <FavoriteIcon sx={{ mr: 2, fontSize: 40, color: 'red' }} />
        <Typography variant="h4" component="h1">
          Meus Pets Favoritos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ ml: 2, alignSelf: 'flex-end' }}>
          ({favoritos.length} {favoritos.length === 1 ? 'pet' : 'pets'})
        </Typography>
      </Box>

      {favoritos.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <FavoriteIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Nenhum pet favoritado ainda
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Explore os pets disponíveis e adicione seus favoritos clicando no ícone ❤️
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<PetsIcon />}
            onClick={() => navigate('/search-pets')}
            size="large"
          >
            Explorar Pets
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {favoritos.map((pet) => (
            <Grid item xs={12} sm={6} md={4} key={pet._id}>
              <PetCard pet={pet} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Favoritos;