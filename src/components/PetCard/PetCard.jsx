import React, { useState } from 'react';
import {
  CardMedia, Button, Box, Card, CardActions, CardContent, Typography,
  Modal, Grid, IconButton, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import petPaws from '../../images/PetPaws.jpg';

export default function PetCard({ pet }) {
  const [openModal, setOpenModal] = useState(false);
  const [openAdotarModal, setOpenAdotarModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Proteção contra pet undefined
  if (!pet) {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={petPaws}
          title="Pet não disponível"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Pet não disponível
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Dados do pet (vindo do backend)
  const {
    _id,
    nome = 'Nome não informado',
    descricao = 'Descrição não disponível',
    fotos = [],
    especie = 'Não informada',
    raca,
    idade,
    user = {} // dados do dono
  } = pet;

  const mainImage = fotos.length > 0 ? fotos[0] : petPaws;
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleDeletePet = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/pets/${_id}`);
      
      // Fechar modais
      setOpenDeleteModal(false);
      setOpenModal(false);
      
      // Recarregar a página para atualizar a lista
      window.location.reload();
      
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      alert('Erro ao excluir pet');
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={mainImage}
          title={nome}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {nome}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {descricao?.substring(0, 100)}...
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip label={especie} size="small" variant="outlined" />
            {raca && <Chip label={raca} size="small" variant="outlined" sx={{ ml: 0.5 }} />}
          </Box>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => setOpenModal(true)}>
            Ver mais
          </Button>
          <Button size="small" onClick={() => setOpenAdotarModal(true)}>
            Adotar
          </Button>
        </CardActions>
      </Card>

      {/* Modal Ver Mais */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          overflow: 'auto'
        }}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setOpenModal(false)}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h4" gutterBottom>
            {nome}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* Carrossel de imagens */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <img 
                  src={fotos[imageIndex] || petPaws} 
                  alt={nome}
                  style={{ 
                    width: '100%', 
                    height: 300, 
                    objectFit: 'cover',
                    borderRadius: 8 
                  }}
                />
                
                {/* Controles do carrossel */}
                {fotos.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 8,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                      }}
                      onClick={() => setImageIndex((prev) => prev === 0 ? fotos.length - 1 : prev - 1)}
                    >
                      ‹
                    </IconButton>
                    
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 8,
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                      }}
                      onClick={() => setImageIndex((prev) => prev === fotos.length - 1 ? 0 : prev + 1)}
                    >
                      ›
                    </IconButton>
                  </>
                )}
                
                {/* Indicadores */}
                {fotos.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, gap: 0.5 }}>
                    {fotos.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: index === imageIndex ? 'primary.main' : 'grey.400',
                          cursor: 'pointer'
                        }}
                        onClick={() => setImageIndex(index)}
                      />
                    ))}
                  </Box>
                )}
              </Box>
              
              {/* Miniaturas */}
              {fotos.length > 1 && (
                <Grid container spacing={0.5}>
                  {fotos.map((foto, index) => (
                    <Grid item xs={3} key={index}>
                      <img 
                        src={foto} 
                        alt={`${nome} ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: 60, 
                          objectFit: 'cover',
                          borderRadius: 4,
                          cursor: 'pointer',
                          border: index === imageIndex ? '2px solid #1976d2' : '1px solid #ddd'
                        }}
                        onClick={() => setImageIndex(index)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Informações
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip label={especie} color="primary" sx={{ mr: 1, mb: 1 }} />
                {raca && <Chip label={raca} variant="outlined" sx={{ mr: 1, mb: 1 }} />}
                {idade && <Chip label={`${idade} anos`} variant="outlined" sx={{ mb: 1 }} />}
              </Box>

              <Typography variant="body1" paragraph>
                {descricao}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenModal(false);
                    setOpenAdotarModal(true);
                  }}
                >
                  Entrar em Contato para Adoção
                </Button>
                
                {/* Botão deletar - apenas para o dono */}
                {currentUser && currentUser.id === user._id && (
                  <Button 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenDeleteModal(true)}
                  >
                    Excluir Pet
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Modal Adotar */}
      <Modal open={openAdotarModal} onClose={() => setOpenAdotarModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2
        }}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setOpenAdotarModal(false)}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" gutterBottom>
            Contato para Adoção
          </Typography>

          <Typography variant="body1" paragraph>
            Entre em contato com o responsável pelo {nome}:
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PhoneIcon />}
              sx={{ mb: 1 }}
              onClick={() => window.open(`tel:${user?.telefone}`)}
              disabled={!user?.telefone}
            >
              Ligar: {user?.telefone || 'Não informado'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<EmailIcon />}
              onClick={() => window.open(`mailto:${user?.email}`)}
            >
              Email: {user?.email}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Lembre-se de se identificar e perguntar sobre o processo de adoção.
          </Typography>
        </Box>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            Confirmar Exclusão
          </Typography>

          <Typography variant="body1" paragraph>
            Tem certeza que deseja excluir <strong>{nome}</strong>? Esta ação não pode ser desfeita.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeletePet}
            >
              Excluir
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}