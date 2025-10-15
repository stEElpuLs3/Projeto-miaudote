import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Container, Stack } from "@mui/material";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import LoginForm from '../../components/LoginForm/LoginForm'; // caminho corrigido

const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  const [openLoginModal, setOpenLoginModal] = useState(false);

  // Abrir modal de login
  const handleOpenLogin = () => {
    console.log('Abrindo modal de login');
    setOpenLoginModal(true);
  };

  // Fechar modal de login
  const handleCloseLogin = () => {
    console.log('Fechando modal de login');
    setOpenLoginModal(false);
  };

  // Função de cadastro
  const handleCadastro = async () => {
    console.log('Tentando cadastrar usuário com os dados:', { name, email, password, phone, avatar });

    try {
      const response = await axios.post('http://localhost:3001/api/usuarios', {
        name,
        email,
        password,
        phone,
        avatar
      });

      console.log('Resposta do backend:', response.data);
      alert(response.data.message);

      // Limpar formulário
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAvatar('');

    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error.response ? error.response.data : error);
      alert(error.response?.data?.message || 'Erro ao cadastrar usuário');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Cadastro
        </Typography>

        <Stack spacing={2}>
          <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <TextField label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
          <TextField label="Avatar (URL)" value={avatar} onChange={(e) => setAvatar(e.target.value)} fullWidth />

          <Button variant="contained" color="primary" onClick={handleCadastro}>
            Cadastrar
          </Button>

          <Button variant="outlined" onClick={handleOpenLogin}>
            Já tenho uma conta
          </Button>
        </Stack>
      </Box>

      {/* Modal de login */}
      <Modal
        open={openLoginModal}
        onClose={handleCloseLogin}
        aria-labelledby="modal-login"
        aria-describedby="modal-login-form"
      >
        <Box sx={{ margin: '10% auto', padding: '20px', backgroundColor: 'white', width: '400px' }}>
          <LoginForm closeModal={handleCloseLogin} />
        </Box>
      </Modal>
    </Container>
  );
};

export default Cadastro;
