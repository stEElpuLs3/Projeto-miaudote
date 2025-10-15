import React, { Fragment, useState } from "react";
import { Box, Button, Modal, TextField, Typography, Stack } from "@mui/material";
import axios from "axios";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function Login({ open, handleClose, setOpenModal }) {
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
        localStorage.setItem("user", JSON.stringify({ ...response.data.usuario, logado: true }));
        setOpenModal(false);
        handleClose();
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
    <Fragment>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-login">
        <Box sx={style}>
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
          </Stack>
        </Box>
      </Modal>
    </Fragment>
  );
}
