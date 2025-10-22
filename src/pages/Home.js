import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material'; // Removido Grid2 não utilizado
import PetCard from '../components/PetCard/PetCard';
import LoginModal from '../components/LoginModal/LoginModal'
import Rufus from '../images/rufus.avif'
import axios from 'axios';

function Home({isOpenModal, setOpenModal}) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dados mockados dentro do useEffect para evitar recriações
    const petsMock = [
      { 
        _id: 1, 
        nome: 'Fofinho', 
        descricao: 'Gato muito carinhoso!', 
        fotos: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKy5Zq3nDNcIKQEtTvd1iJTSzxQk4UO53QrA&s'],
        especie: 'gato',
        raca: 'SRD',
        idade: 2,
        user: {
          nome: 'João Silva',
          email: 'joao@email.com',
          telefone: '(11) 99999-9999'
        }
      },
      { 
        _id: 2, 
        nome: 'Rex', 
        descricao: 'Cachorro brincalhão e esperto.', 
        fotos: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTekrqEm8Pps8NR1x2kRA2N2WTL23Q9R9nVbw&s'],
        especie: 'cachorro',
        raca: 'Vira-lata',
        idade: 3,
        user: {
          nome: 'Maria Santos',
          email: 'maria@email.com',
          telefone: '(11) 98888-8888'
        }
      },
      { 
        _id: 3, 
        nome: 'Rufus', 
        descricao: 'Cachorro dócil e amigável.', 
        fotos: [Rufus],
        especie: 'cachorro', 
        raca: 'Labrador',
        idade: 4,
        user: {
          nome: 'Pedro Oliveira',
          email: 'pedro@email.com', 
          telefone: '(11) 97777-7777'
        }
      }
    ];

    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/pets');
        setPets(response.data);
      } catch (error) {
        console.error('Erro ao buscar pets da API, usando dados mockados:', error);
        setPets(petsMock); // Fallback para dados mockados
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []); // Array vazio - executa apenas uma vez

  if (loading) {
    return (
      <Container sx={{ minHeight: "120vh" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Carregando pets...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ minHeight: "120vh" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pets para Adoção
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {pets.map((pet) => (
          <PetCard 
            key={pet._id} 
            pet={pet}
          />
        ))}
      </Box>

      <LoginModal open={isOpenModal} onClose={() => setOpenModal(!isOpenModal)} />
    </Container>
  );
}

export default Home;