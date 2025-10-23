import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Modal,
  MenuItem, Chip, Grid, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function RegisterPet() {
  const [open, setOpen] = useState(false);
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

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem('user'));

      // Tenta enviar com imagens primeiro
      try {
        const formData = new FormData();

        // Adiciona todos os campos como strings individuais
        formData.append('nome', petData.nome);
        formData.append('especie', petData.especie);
        formData.append('raca', petData.raca);
        formData.append('idade', petData.idade);
        formData.append('descricao', petData.descricao);
        formData.append('user', user.id);

        // Adiciona campos de endereço individualmente
        formData.append('cep', petData.endereco.cep);
        formData.append('rua', petData.endereco.rua);
        formData.append('numero', petData.endereco.numero);
        formData.append('bairro', petData.endereco.bairro);
        formData.append('cidade', petData.endereco.cidade);
        formData.append('estado', petData.endereco.estado);

        images.forEach((image) => {
          formData.append('images', image);
        });

        const response = await axios.post('http://localhost:3001/api/pets', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Pet cadastrado com sucesso:', response.data);
        setOpen(true);

      } catch (uploadError) {
        console.log('Upload de imagens falhou, cadastrando sem imagens:', uploadError);

        // Fallback: cadastra sem imagens como JSON
        const response = await axios.post('http://localhost:3001/api/pets', {
          nome: petData.nome,
          especie: petData.especie,
          raca: petData.raca,
          idade: petData.idade,
          descricao: petData.descricao,
          user: user.id,
          cep: petData.endereco.cep,
          rua: petData.endereco.rua,
          numero: petData.endereco.numero,
          bairro: petData.endereco.bairro,
          cidade: petData.endereco.cidade,
          estado: petData.endereco.estado
        });

        console.log('Pet cadastrado sem imagens:', response.data);
        setOpen(true);
      }

      // Limpar formulário
      setPetData({
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
      setImages([]);
      setImagePreviews([]);

    } catch (error) {
      console.error('Erro ao cadastrar pet:', error);
      alert('Erro ao cadastrar pet: ' + error.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Cadastrar Pet
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="nome"
              label="Nome do Pet"
              variant="outlined"
              fullWidth
              margin="normal"
              value={petData.nome}
              onChange={handleInputChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="especie"
              label="Espécie"
              variant="outlined"
              fullWidth
              margin="normal"
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
              variant="outlined"
              fullWidth
              margin="normal"
              value={petData.raca}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="idade"
              label="Idade (anos)"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={petData.idade}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="descricao"
              label="Diga mais sobre o pet"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={petData.descricao}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Localização do Pet
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              name="endereco.cep"
              label="CEP"
              variant="outlined"
              fullWidth
              value={petData.endereco.cep}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="endereco.rua"
              label="Rua"
              variant="outlined"
              fullWidth
              value={petData.endereco.rua}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              name="endereco.numero"
              label="Número"
              variant="outlined"
              fullWidth
              value={petData.endereco.numero}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="endereco.bairro"
              label="Bairro"
              variant="outlined"
              fullWidth
              value={petData.endereco.bairro}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="endereco.cidade"
              label="Cidade"
              variant="outlined"
              fullWidth
              value={petData.endereco.cidade}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="endereco.estado"
              label="Estado"
              variant="outlined"
              fullWidth
              select
              value={petData.endereco.estado}
              onChange={handleInputChange}
            >
              <MenuItem value="AC">Acre</MenuItem>
              <MenuItem value="AL">Alagoas</MenuItem>
              <MenuItem value="AP">Amapá</MenuItem>
              <MenuItem value="AM">Amazonas</MenuItem>
              <MenuItem value="BA">Bahia</MenuItem>
              <MenuItem value="CE">Ceará</MenuItem>
              <MenuItem value="DF">Distrito Federal</MenuItem>
              <MenuItem value="ES">Espírito Santo</MenuItem>
              <MenuItem value="GO">Goiás</MenuItem>
              <MenuItem value="MA">Maranhão</MenuItem>
              <MenuItem value="MT">Mato Grosso</MenuItem>
              <MenuItem value="MS">Mato Grosso do Sul</MenuItem>
              <MenuItem value="MG">Minas Gerais</MenuItem>
              <MenuItem value="PA">Pará</MenuItem>
              <MenuItem value="PB">Paraíba</MenuItem>
              <MenuItem value="PR">Paraná</MenuItem>
              <MenuItem value="PE">Pernambuco</MenuItem>
              <MenuItem value="PI">Piauí</MenuItem>
              <MenuItem value="RJ">Rio de Janeiro</MenuItem>
              <MenuItem value="RN">Rio Grande do Norte</MenuItem>
              <MenuItem value="RS">Rio Grande do Sul</MenuItem>
              <MenuItem value="RO">Rondônia</MenuItem>
              <MenuItem value="RR">Roraima</MenuItem>
              <MenuItem value="SC">Santa Catarina</MenuItem>
              <MenuItem value="SP">São Paulo</MenuItem>
              <MenuItem value="SE">Sergipe</MenuItem>
              <MenuItem value="TO">Tocantins</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Preview das Imagens */}
        {imagePreviews.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Imagens do Pet ({imagePreviews.length})
            </Typography>
            <Grid container spacing={1}>
              {imagePreviews.map((preview, index) => (
                <Grid item key={index}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={preview.preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border: index === 0 ? '3px solid #1976d2' : '1px solid #ddd'
                      }}
                    />
                    {index === 0 && (
                      <Chip
                        label="Principal"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          left: 5,
                          fontSize: '0.6rem'
                        }}
                      />
                    )}
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
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Adicionar Imagens
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!petData.nome || !petData.especie}
          >
            Cadastrar Pet
          </Button>
        </Box>
      </form>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            🎉 Parabéns!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            O pet foi cadastrado com sucesso!
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setOpen(false)}
          >
            Fechar
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default RegisterPet;