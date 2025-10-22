// src/components/Chat/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Container, Typography, TextField, Button, Paper,
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Badge, IconButton, Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

function Chat() {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user) {
      fetchMensagens();
    }
  }, [user]);

  const fetchMensagens = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/mensagens/usuario/${user.id}`);
      setMensagens(response.data);
      
      // Extrair usuários únicos das conversas
      const usuariosUnicos = [];
      response.data.forEach(msg => {
        const outroUsuario = msg.remetente._id === user.id ? msg.destinatario : msg.remetente;
        if (!usuariosUnicos.find(u => u._id === outroUsuario._id)) {
          usuariosUnicos.push(outroUsuario);
        }
      });
      setUsuarios(usuariosUnicos);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !usuarioSelecionado) return;

    try {
      const response = await axios.post('http://localhost:3001/api/mensagens', {
        remetente: user.id,
        destinatario: usuarioSelecionado._id,
        pet: petSelecionado?._id,
        mensagem: novaMensagem,
        tipo: 'mensagem'
      });

      setMensagens(prev => [response.data.mensagem, ...prev]);
      setNovaMensagem('');
      
      // Scroll para baixo
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    }
  };

  const mensagensConversa = mensagens.filter(msg =>
    (msg.remetente._id === user.id && msg.destinatario._id === usuarioSelecionado?._id) ||
    (msg.remetente._id === usuarioSelecionado?._id && msg.destinatario._id === user.id)
  ).reverse();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mensagens
      </Typography>

      <Box sx={{ display: 'flex', height: '70vh', border: 1, borderColor: 'divider' }}>
        {/* Lista de conversas */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          <Typography variant="h6" sx={{ p: 2, bgcolor: 'background.default' }}>
            Conversas
          </Typography>
          <List>
            {usuarios.map(usuario => (
              <ListItem
                key={usuario._id}
                button
                selected={usuarioSelecionado?._id === usuario._id}
                onClick={() => setUsuarioSelecionado(usuario)}
              >
                <ListItemAvatar>
                  <Avatar src={usuario.avatar} alt={usuario.nome}>
                    {usuario.nome?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={usuario.nome} 
                  secondary={mensagens.find(m => 
                    (m.remetente._id === usuario._id || m.destinatario._id === usuario._id) && !m.lida
                  ) && 'Nova mensagem'}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Área de mensagens */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {usuarioSelecionado ? (
            <>
              {/* Cabeçalho da conversa */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                <Typography variant="h6">
                  Conversa com {usuarioSelecionado.nome}
                </Typography>
              </Box>

              {/* Mensagens */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {mensagensConversa.map((msg) => (
                  <Box
                    key={msg._id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.remetente._id === user.id ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: msg.remetente._id === user.id ? 'primary.main' : 'grey.100',
                        color: msg.remetente._id === user.id ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body1">{msg.mensagem}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input de mensagem */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                  />
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={enviarMensagem}
                    disabled={!novaMensagem.trim()}
                  >
                    Enviar
                  </Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                Selecione uma conversa
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Chat;