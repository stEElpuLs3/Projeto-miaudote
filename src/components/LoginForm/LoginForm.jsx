import React, { useState } from "react";
import { Box, Button, TextField, Typography, Stack, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

export default function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
  try {
    console.log('Tentando login com:', { email, senha });
    
    const response = await axios.post("http://localhost:3001/api/usuarios/login", {
      email: email,
      senha: senha,
    });

    console.log('Resposta do login:', response.data);

    if (response.data && response.data.user) {
      // CRIAR OBJETO COMPLETO DO USUÁRIO
      const userData = {
        _id: response.data.user.id, // ID do MongoDB
        name: response.data.user.nome,
        email: response.data.user.email,
        phone: response.data.user.telefone || '',
        avatar: response.data.user.avatar || '', // ← AGORA INCLUÍDO
        logado: true,
        token: response.data.token,
        favorites: response.data.user.favoritos || [],
        socialMedia: response.data.user.redeSocial || {},
        address: response.data.user.endereco || {},
        about: response.data.user.sobre || ''
      };
      
      console.log('Dados completos do usuário:', userData);

      // SALVAR NO LOCALSTORAGE
      localStorage.setItem("user", JSON.stringify(userData));
      
      // DISPARAR EVENTO PARA ATUALIZAR NAVBAR
      window.dispatchEvent(new Event('userLoggedIn'));

      if (onClose) onClose();
      
      // Redirecionar para home
      window.location.href = "/";
      // OU se preferir recarregar:
      // window.location.reload();
    } else {
      setErro("Credenciais inválidas");
    }
  } catch (err) {
    console.error("Erro completo:", err);
    console.error("Resposta do erro:", err.response?.data);
    setErro(err.response?.data?.message || "Erro ao tentar fazer login");
  }
};


  return (
    <Box>
      <Typography id="modal-login" variant="h5" textAlign="center" mb={2}>
        Entrar
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && (
          <Typography color="error" textAlign="center">
            {erro}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 1 }}
        >
          Entrar
        </Button>
        
        <Typography variant="body2" textAlign="center">
          Não tem uma conta?{" "}
          <Link
            component={RouterLink}
            to="/cadastro-usuario"
            onClick={onClose} // fecha o modal ao clicar no link
            sx={{ 
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Cadastre-se!
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}