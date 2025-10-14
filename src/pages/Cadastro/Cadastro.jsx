// src/components/Cadastro/Cadastro.jsx
import React, { useState } from 'react';
import { Container, Box, Stack, Button, Typography, TextField, Modal, Backdrop, Fade } from '@mui/material';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

function Cadastro() {
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado do Modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    document.activeElement.blur(); // Remove foco do botão antes de abrir o Modal
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCadastrar = async () => {
    try {
      await axios.post('http://localhost:3001/api/usuarios', {
        nome,
        telefone,
        email,
        senha,
        historico: []
      });

      // Limpa campos após cadastro
      setNome('');
      setTelefone('');
      setEmail('');
      setSenha('');

      handleOpen(); // Abre modal de sucesso
    } catch (err) {
      console.error('Erro ao cadastrar:', err);
      alert('Erro ao cadastrar usuário!');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Cadastro de Usuário
        </Typography>
        <Stack spacing={2}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <Button variant="contained" onClick={handleCadastrar}>Cadastrar</Button>
        </Stack>
      </Box>

      {/* Modal de sucesso */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        aria-labelledby="modal-sucesso"
        aria-describedby="modal-mensagem"
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="modal-sucesso" variant="h6">
              Cadastro realizado com sucesso!
            </Typography>
            <Button onClick={handleClose} sx={{ mt: 2 }} variant="contained">
              Fechar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}

export default Cadastro;
