import React, { useState, useEffect } from 'react';
import { Container, Typography, Avatar, Grid, Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import PetCard from '../components/PetCard/PetCard';

function Profile() {
  const [user, setUser] = useState(null);
  const [userPets, setUserPets] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    if (userData) {
      fetchUserPets(userData.id);
    }
  }, []);

  const handleDeletePet = async (petId) => {
    try {
      await axios.delete(`http://localhost:3001/api/pets/${petId}`);
      // Atualizar a lista de pets
      fetchUserPets(user.id);
      alert('Pet excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      alert('Erro ao excluir pet');
    }
  };

  const fetchUserPets = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pets/user/${userId}`);
      setUserPets(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets do usuário:', error);
    }
  };

  if (!user) return <Typography variant="h4">Usuário não encontrado</Typography>;

  return (
    <Container>
      {/* Cabeçalho do Perfil */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item>
          <Avatar alt={user.nome} src={user.avatar} sx={{ width: 100, height: 100, bgcolor: 'orange' }} />
        </Grid>
        <Grid item>
          <Typography variant="h4">{user.nome}</Typography>
          <Typography variant="body1">{user.email}</Typography>
          <Button startIcon={<EditIcon />} variant="outlined" sx={{ mt: 2 }}>
            Editar Perfil
          </Button>
        </Grid>
      </Grid>

      {/* Seção de Meus Pets */}
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 3 }}>
        Meus Pets
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {userPets.length > 0 ? (
          userPets.map((pet) => (
            <Box key={pet._id} sx={{ position: 'relative' }}>
              <PetCard pet={pet} />
              <Button 
                variant="contained" 
                color="error" 
                size="small"
                startIcon={<DeleteIcon />}
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  zIndex: 10,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,235,235,0.9)'
                  }
                }}
                onClick={() => {
                  if (window.confirm(`Deseja excluir ${pet.nome}?`)) {
                    handleDeletePet(pet._id);
                  }
                }}
              >
                Excluir
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            Você ainda não cadastrou nenhum pet.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Profile;