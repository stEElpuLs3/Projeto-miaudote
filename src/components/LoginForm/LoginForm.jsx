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
      const response = await axios.post("http://localhost:3001/api/usuarios/login", {
        email,
        senha,
      });

      if (response.data && response.data.usuario) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...response.data.usuario, logado: true })
        );

        if (onClose) onClose(); // fecha o modal
        window.location.reload();
      } else {
        setErro("Credenciais inválidas");
      }
    } catch (err) {
      console.error(err);
      setErro("Erro ao tentar fazer login");
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
            to="/cadastro"
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