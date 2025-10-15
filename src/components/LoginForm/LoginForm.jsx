import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const LoginForm = ({ closeModal }) => {
  const [identifier, setIdentifier] = useState(''); // email ou nome
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    console.log('Tentando login com:', { identifier, password });

    if (!identifier || !password) {
      setErro('Preencha todos os campos!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/usuarios/login', {
        identifier,
        senha: password, // backend espera "senha"
      });

      console.log('Resposta do backend:', response.data);

      if (response.data?.mensagem === 'Login sucesso') {
        localStorage.setItem('user', JSON.stringify({ ...response.data.user, logado: true }));

        // Fecha o modal corretamente
        if (typeof closeModal === 'function') closeModal();

        setIdentifier('');
        setPassword('');
        setErro('');
        window.location.reload();
      } else {
        setErro('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error.response ? error.response.data : error);
      setErro(error.response?.data?.mensagem || 'Erro no login');
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Email ou Nome"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        fullWidth
      />
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />

      {erro && (
        <Typography color="error" textAlign="center">
          {erro}
        </Typography>
      )}

      <Button variant="contained" color="primary" onClick={handleLogin}>
        Entrar
      </Button>
    </Stack>
  );
};

export default LoginForm;
