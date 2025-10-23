import React, { useState, useEffect, useCallback } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

function FavoritoButton({ petId, size = 'medium' }) {
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const verificarFavorito = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:3001/api/favoritos/${user.id}`);
      const isFavorited = response.data.some(pet => pet._id === petId);
      setIsFavorito(isFavorited);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  }, [user, petId]);

  useEffect(() => {
    if (user) {
      verificarFavorito();
    }
  }, [verificarFavorito, user]);

  const toggleFavorito = async () => {
    if (!user) {
      alert('Faça login para favoritar pets!');
      return;
    }

    setLoading(true);
    try {
      if (isFavorito) {
        await axios.delete(`http://localhost:3001/api/favoritos/${user.id}/favoritar/${petId}`);
        setIsFavorito(false);
      } else {
        await axios.post(`http://localhost:3001/api/favoritos/${user.id}/favoritar/${petId}`);
        setIsFavorito(true);
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      alert('Erro ao favoritar pet');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Tooltip title={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
      <IconButton 
        onClick={toggleFavorito} 
        disabled={loading}
        color={isFavorito ? "error" : "default"}
        size={size}
        sx={{
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)'
          }
        }}
      >
        {isFavorito ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default FavoritoButton;