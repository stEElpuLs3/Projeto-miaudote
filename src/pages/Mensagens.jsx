import React, { useState, useEffect, useCallback } from 'react'; // Adicione useCallback
import {
  Container, Typography, Box, Card, CardContent,
  Avatar, Button, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PetsIcon from '@mui/icons-material/Pets';
import axios from 'axios';

function Mensagens() {
  const [mensagens, setMensagens] = useState([]);
  const [mensagemSelecionada, setMensagemSelecionada] = useState(null);
  const [openResponder, setOpenResponder] = useState(false);
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  // Mova fetchMensagens para useCallback
  const fetchMensagens = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/mensagens/usuario/${user.id}`);
      setMensagens(response.data);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  }, [user.id]); // Adicione user.id como dependência

  useEffect(() => {
    fetchMensagens();
  }, [fetchMensagens]); // Adicione fetchMensagens como dependência

  const mensagensRecebidas = mensagens.filter(msg => 
    msg.destinatario._id === user.id
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleResponder = async () => {
    if (!resposta.trim()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/mensagens', {
        remetente: user.id,
        destinatario: mensagemSelecionada.remetente._id,
        pet: mensagemSelecionada.pet?._id,
        mensagem: resposta,
        tipo: 'resposta'
      });

      // Marcar mensagem original como lida
      await axios.put(`http://localhost:3001/api/mensagens/${mensagemSelecionada._id}/lida`);

      setResposta('');
      setOpenResponder(false);
      setMensagemSelecionada(null);
      fetchMensagens(); // Recarregar mensagens
      alert('Resposta enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (mensagemId) => {
    if (window.confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        await axios.delete(`http://localhost:3001/api/mensagens/${mensagemId}`);
        fetchMensagens(); // Recarregar mensagens
        alert('Mensagem excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
        alert('Erro ao excluir mensagem');
      }
    }
  };

  const getIconeRedeSocial = (plataforma) => {
    const icones = {
      instagram: '📷',
      facebook: '👥', 
      twitter: '🐦',
      tiktok: '🎵',
      outro: '🔗'
    };
    return icones[plataforma] || '🔗';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        📨 Caixa de Entrada
      </Typography>

      {mensagensRecebidas.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <EmailIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhuma mensagem recebida
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quando alguém se interessar por seus pets, as mensagens aparecerão aqui.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mensagensRecebidas.map((mensagem) => (
            <Card 
              key={mensagem._id} 
              sx={{ 
                borderLeft: mensagem.lida ? '4px solid #e0e0e0' : '4px solid #1976d2',
                backgroundColor: mensagem.lida ? 'background.paper' : 'action.hover'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={mensagem.remetente.avatar}>
                      {mensagem.remetente.nome?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {mensagem.remetente.nome}
                        {mensagem.remetente.redeSocial?.plataforma && (
                          <span style={{ marginLeft: 8 }}>
                            {getIconeRedeSocial(mensagem.remetente.redeSocial.plataforma)}
                            {mensagem.remetente.redeSocial.usuario}
                          </span>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mensagem.remetente.email}
                        {mensagem.remetente.telefone && ` • ${mensagem.remetente.telefone}`}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setMensagemSelecionada(mensagem);
                        setOpenResponder(true);
                      }}
                    >
                      <ReplyIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeletar(mensagem._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {mensagem.pet && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <PetsIcon color="primary" />
                    <Chip 
                      label={`Interesse em ${mensagem.pet.nome}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                )}

                <Typography variant="body1" paragraph>
                  "{mensagem.mensagem}"
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(mensagem.createdAt).toLocaleString('pt-BR')}
                  </Typography>
                  {!mensagem.lida && (
                    <Chip label="Nova" size="small" color="primary" />
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Modal de Resposta */}
      <Dialog open={openResponder} onClose={() => setOpenResponder(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Responder {mensagemSelecionada?.remetente.nome}
          {mensagemSelecionada?.pet && ` sobre ${mensagemSelecionada.pet.nome}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Mensagem original:
              </Typography>
              <Card variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                <Typography variant="body1">
                  "{mensagemSelecionada?.mensagem}"
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Sua resposta"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                placeholder="Digite sua resposta aqui..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResponder(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleResponder} 
            variant="contained" 
            disabled={loading || !resposta.trim()}
          >
            {loading ? 'Enviando...' : 'Enviar Resposta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Mensagens;