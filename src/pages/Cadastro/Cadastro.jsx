import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Container, Stack } from "@mui/material";
import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { UserClass } from "../../UserClass";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};



export default function Cadastro() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        window.location.href = "/";
    };

    // Forms
    const [nome, setNome] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");

    async function Cadastrar(e) {
    e.preventDefault();
    
    const newUser = {
        nome,
        telefone,
        email,
        senha,
        historico: [], // se quiser manter esse campo
    };

    try {
        // Aqui chamamos a rota do backend
        const res = await fetch('/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (res.ok) {
            handleOpen(); // modal de sucesso
        } else {
            alert("Erro ao cadastrar usuário");
        }

    } catch (error) {
        console.log(error);
        alert("Erro ao conectar com o servidor");
    }
}

    return (
        <Container maxWidth="xs">
            <Typography variant="h6" component="h2">CADASTRO DE USUÁRIO</Typography>
            <Stack
                component="form"
                sx={{ display: "flex", alignItems: "center", '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                onSubmit={Cadastrar}
            >
                <TextField
                    id="outlined"
                    label="Nome"
                    defaultValue=""
                    required
                    sx={{minWidth: '100%'}}
                    onChange={e => { setNome(e.target.value) }}
                />

                <TextField
                    id="outlined-number"
                    label="Telefone"
                    type="tel"
                    required
                    sx={{minWidth: '100%'}}
                    onChange={e => { setTelefone(e.target.value) }}
                />

                <TextField
                    id="outlined-email"
                    label="Email"
                    type="mail"
                    required
                    sx={{minWidth: '100%'}}
                    onChange={e => { setEmail(e.target.value) }}
                />

                <TextField
                    id="outlined-password-input"
                    label="Senha"
                    type="password"
                    autoComplete="current-password"
                    required
                    sx={{minWidth: '100%'}}
                    onChange={e => { setSenha(e.target.value) }}
                />
                <Button variant="contained" type="submit" fullWidth>Confirmar</Button>
            </Stack>
            <div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Parabens!
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Seu cadastro foi realizado com sucesso!
                        </Typography>
                        <Button variant='contained' onClick={handleClose} sx={{ mt: 2 }}>Fechar</Button>
                    </Box>
                </Modal>
            </div>
        </Container>
    );
}