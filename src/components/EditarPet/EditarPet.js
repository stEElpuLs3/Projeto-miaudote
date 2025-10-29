import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Grid, MenuItem, Chip,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

function EditarPet({ open, onClose, pet, onPetUpdate }) {
  const [petData, setPetData] = useState({
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    descricao: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Reset do estado quando o modal abre
  useEffect(() => {
    if (open && pet) {
      setPetData({
        nome: pet.nome || '',
        especie: pet.especie || '',
        raca: pet.raca || '',
        idade: pet.idade || '',
        descricao: pet.descricao || '',
        endereco: pet.endereco || {
          cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: ''
        }
      });
      setImagePreviews(pet.fotos || []);
      setImages([]);
    }
  }, [open, pet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPetData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPetData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];

    // Se é uma imagem existente (string URL), marca para remoção
    if (typeof newPreviews[index] === 'string') {
      newPreviews[index] = { markedForDelete: true };
    } else {
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
    }

    setImages(newImages);
    setImagePreviews(newPreviews.filter(preview => !preview.markedForDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      // Verifica se o usuário é o dono do pet
      if (pet.user._id !== user.id && pet.user !== user.id) {
        alert('Apenas o dono do pet pode editá-lo');
        return;
      }

      const formData = new FormData();
      formData.append('nome', petData.nome);
      formData.append('especie', petData.especie);
      formData.append('raca', petData.raca);
      formData.append('idade', petData.idade);
      formData.append('descricao', petData.descricao);
      
      // Campos de endereço individuais
      formData.append('cep', petData.endereco.cep);
      formData.append('rua', petData.endereco.rua);
      formData.append('numero', petData.endereco.numero);
      formData.append('bairro', petData.endereco.bairro);
      formData.append('cidade', petData.endereco.cidade);
      formData.append('estado', petData.endereco.estado);

      // Novas imagens
      images.forEach((image) => {
        formData.append('images', image);
      });

      // Imagens para remover (seria implementado no backend)
      const imagesToRemove = imagePreviews
        .filter(preview => preview.markedForDelete)
        .map((preview, index) => index);
      
      if (imagesToRemove.length > 0) {
        formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
      }

      const response = await axios.put(
        `http://localhost:3001/api/pets/${pet._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onPetUpdate(response.data.pet);
      onClose();
      alert('Pet atualizado com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
      alert('Erro ao atualizar pet');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Pet</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Dados Básicos */}
            <Grid item xs={12} md={6}>
              <TextField
                name="nome"
                label="Nome do Pet"
                fullWidth
                value={petData.nome}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="especie"
                label="Espécie"
                fullWidth
                select
                value={petData.especie}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="cachorro">Cachorro</MenuItem>
                <MenuItem value="gato">Gato</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="raca"
                label="Raça"
                fullWidth
                value={petData.raca}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="idade"
                label="Idade (anos)"
                fullWidth
                type="number"
                value={petData.idade}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="descricao"
                label="Sobre o pet"
                fullWidth
                multiline
                rows={3}
                value={petData.descricao}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Endereço */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <strong>Localização do Pet</strong>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      name="endereco.cep"
                      label="CEP"
                      fullWidth
                      value={petData.endereco.cep}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      name="endereco.rua"
                      label="Rua"
                      fullWidth
                      value={petData.endereco.rua}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      name="endereco.numero"
                      label="Número"
                      fullWidth
                      value={petData.endereco.numero}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="endereco.bairro"
                      label="Bairro"
                      fullWidth
                      value={petData.endereco.bairro}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="endereco.cidade"
                      label="Cidade"
                      fullWidth
                      value={petData.endereco.cidade}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      name="endereco.estado"
                      label="Estado"
                      fullWidth
                      select
                      value={petData.endereco.estado}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="AC">Acre</MenuItem>
                      <MenuItem value="AL">Alagoas</MenuItem>
                      {/* ... outros estados */}
                      <MenuItem value="ES">Espírito Santo</MenuItem>
                      {/* ... outros estados */}
                      <MenuItem value="SP">São Paulo</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Imagens */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                >
                  Adicionar Imagens
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
              </Box>

              {imagePreviews.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {imagePreviews.map((preview, index) => (
                      <Grid item key={index}>
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={preview.preview || preview}
                            alt={`Preview ${index}`}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 8,
                              opacity: preview.markedForDelete ? 0.5 : 1
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              backgroundColor: 'rgba(255,255,255,0.8)'
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          {preview.markedForDelete && (
                            <Chip
                              label="Remover"
                              color="error"
                              size="small"
                              sx={{
                                position: 'absolute',
                                bottom: 5,
                                left: 5
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
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

export default EditarPet;