import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Avatar, IconButton,
  Grid, MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

function EditarPerfil({ open, onClose, user, onUserUpdate }) {
  const [userData, setUserData] = useState({
    nome: '',
    telefone: '',
    redeSocial: { plataforma: '', usuario: '' },
    endereco: { cep: '', rua: '', numero: '', cidade: '', estado: '' },
    sobre: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset do estado quando o modal abre/fecha
  useEffect(() => {
    if (open && user) {
      setUserData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        redeSocial: user.redeSocial || { plataforma: '', usuario: '' },
        endereco: user.endereco || { cep: '', rua: '', numero: '', cidade: '', estado: '' },
        sobre: user.sobre || ''
      });
      setAvatarPreview(user.avatar || '');
      setAvatarFile(null);
    }
  }, [open, user]); // Só executa quando open ou user mudam

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('redeSocial.')) {
      const field = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        redeSocial: { 
          ...prev.redeSocial, 
          [field]: value 
        }
      }));
    } else if (name.startsWith('endereco.')) {
      const field = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        endereco: { 
          ...prev.endereco, 
          [field]: value 
        }
      }));
    } else {
      setUserData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nome', userData.nome);
      formData.append('telefone', userData.telefone);
      formData.append('redeSocial', JSON.stringify(userData.redeSocial));
      formData.append('endereco', JSON.stringify(userData.endereco));
      formData.append('sobre', userData.sobre);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await axios.put(`http://localhost:3001/api/usuarios/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = { ...user, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUserUpdate(updatedUser);
      
      onClose();
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Perfil</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Avatar */}
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={avatarPreview}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: -10,
                    backgroundColor: 'white'
                  }}
                >
                  <CloudUploadIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </IconButton>
              </Box>
            </Grid>

            {/* Dados Básicos */}
            <Grid item xs={12} md={6}>
              <TextField
                name="nome"
                label="Nome Completo"
                fullWidth
                value={userData.nome}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="telefone"
                label="Telefone"
                fullWidth
                value={userData.telefone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
              />
            </Grid>

            {/* Rede Social */}
            <Grid item xs={12} md={6}>
              <TextField
                name="redeSocial.plataforma"
                label="Rede Social"
                fullWidth
                select
                value={userData.redeSocial.plataforma || ''}
                onChange={handleInputChange}
              >
                <MenuItem value="">Nenhuma</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="tiktok">TikTok</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="redeSocial.usuario"
                label="Usuário"
                fullWidth
                value={userData.redeSocial.usuario || ''}
                onChange={handleInputChange}
                placeholder="@usuario"
                disabled={!userData.redeSocial.plataforma}
              />
            </Grid>

            {/* Endereço */}
            <Grid item xs={12} md={3}>
              <TextField
                name="endereco.cep"
                label="CEP"
                fullWidth
                value={userData.endereco.cep || ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="endereco.rua"
                label="Rua"
                fullWidth
                value={userData.endereco.rua || ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                name="endereco.numero"
                label="Número"
                fullWidth
                value={userData.endereco.numero || ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="endereco.cidade"
                label="Cidade"
                fullWidth
                value={userData.endereco.cidade || ''}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="endereco.estado"
                label="Estado"
                fullWidth
                value={userData.endereco.estado || ''}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Sobre */}
            <Grid item xs={12}>
              <TextField
                name="sobre"
                label="Sobre mim"
                fullWidth
                multiline
                rows={3}
                value={userData.sobre || ''}
                onChange={handleInputChange}
                placeholder="Conte um pouco sobre você..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditarPerfil;