import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Typography, Avatar, Grid, Card, 
  Button, Box, Chip, Divider, Paper 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import MessageIcon from '@mui/icons-material/Message';
import PetsIcon from '@mui/icons-material/Pets';
import axios from 'axios';
import PetCard from '../components/PetCard/PetCard';
import EditarPerfil from '../components/EditarPerfil/EditarPerfil';

function Profile() {
  const [user, setUser] = useState(null);
  const [userPets, setUserPets] = useState([]);
  const [openEditarPerfil, setOpenEditarPerfil] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    totalPets: 0,
    mensagensRecebidas: 0,
    petsAdotados: 0
  });

  const fetchUserPets = useCallback(async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/pets/user/${userId}`);
      setUserPets(response.data);
    } catch (error) {
      console.error('Erro ao buscar pets do usuário:', error);
    }
  }, []);

  const fetchEstatisticas = useCallback(async (userId) => {
    try {
      const mensagensResponse = await axios.get(`http://localhost:3001/api/mensagens/usuario/${userId}`);
      const mensagensRecebidas = mensagensResponse.data.filter(msg => 
        msg.destinatario._id === userId
      ).length;

      setEstatisticas({
        totalPets: userPets.length,
        mensagensRecebidas,
        petsAdotados: userPets.filter(pet => pet.status === 'adotado').length
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  }, [userPets]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    if (userData) {
      fetchUserPets(userData.id);
      fetchEstatisticas(userData.id);
    }
  }, [fetchUserPets, fetchEstatisticas]);

  const handleDeletePet = async (petId) => {
    try {
      await axios.delete(`http://localhost:3001/api/pets/${petId}`);
      fetchUserPets(user.id);
      alert('Pet excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      alert('Erro ao excluir pet');
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const getRedeSocialIcon = (plataforma) => {
    const icons = {
      instagram: '📷',
      facebook: '👥',
      twitter: '🐦',
      tiktok: '🎵',
      outro: '🔗'
    };
    return icons[plataforma] || '🔗';
  };

  if (!user) return <Typography variant="h4">Usuário não encontrado</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho do Perfil */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
            <Avatar
              src={user.avatar}
              sx={{ 
                width: 150, 
                height: 150, 
                mx: 'auto',
                border: '4px solid',
                borderColor: 'primary.main'
              }}
            >
              {user.nome?.charAt(0)}
            </Avatar>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {user.nome}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EmailIcon color="action" />
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
            </Box>

            {user.telefone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PhoneIcon color="action" />
                <Typography variant="body1" color="text.secondary">
                  {user.telefone}
                </Typography>
              </Box>
            )}

            {user.redeSocial?.plataforma && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LinkIcon color="action" />
                <Typography variant="body1">
                  {getRedeSocialIcon(user.redeSocial.plataforma)} 
                  {user.redeSocial.usuario}
                </Typography>
                <Chip 
                  label={user.redeSocial.plataforma} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            )}

            {user.endereco?.cidade && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOnIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {user.endereco.cidade}, {user.endereco.estado}
                </Typography>
              </Box>
            )}

            {user.sobre && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{user.sobre}"
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<EditIcon />}
                onClick={() => setOpenEditarPerfil(true)}
                fullWidth
              >
                Editar Perfil
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<MessageIcon />}
                href="/mensagens"
                fullWidth
              >
                Ver Mensagens
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <PetsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="primary">
              {estatisticas.totalPets}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pets Cadastrados
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <MessageIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="secondary">
              {estatisticas.mensagensRecebidas}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mensagens Recebidas
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <PetsIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" color="success.main">
              {estatisticas.petsAdotados}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pets Adotados
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Seção de Meus Pets */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Meus Pets
          </Typography>
          <Button 
            variant="contained" 
            href="/register-pet"
            startIcon={<PetsIcon />}
          >
            Cadastrar Novo Pet
          </Button>
        </Box>

        {userPets.length > 0 ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
            gap: 3 
          }}>
            {userPets.map((pet) => (
              <Box key={pet._id} sx={{ position: 'relative' }}>
                <PetCard pet={pet} />
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small"
                  startIcon={<PetsIcon />}
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
            ))}
          </Box>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <PetsIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum pet cadastrado
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comece cadastrando seu primeiro pet para adoção!
            </Typography>
            <Button 
              variant="contained" 
              href="/register-pet"
              startIcon={<PetsIcon />}
            >
              Cadastrar Primeiro Pet
            </Button>
          </Paper>
        )}
      </Box>

      {/* Modal Editar Perfil */}
      <EditarPerfil
        open={openEditarPerfil}
        onClose={() => setOpenEditarPerfil(false)}
        user={user}
        onUserUpdate={handleUserUpdate}
      />
    </Container>
  );
}

export default Profile;