import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box, Container, Typography } from '@mui/material';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NavBar from './components/NavBar/NavBar';
import RegisterPet from './pages/RegisterPet';
import SearchPets from './pages/SearchPets';
import SuccessStories from './pages/SuccessStories';
import Cadastro from './pages/Cadastro/Cadastro';
import LoginModal from './components/LoginModal/LoginModal';
import Mensagens from './pages/Mensagens'; // Já está importado
import './styles.css';
import './App.css';

function App() {
  const LogOut = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.logado = false;
      localStorage.setItem("user", JSON.stringify(user));
    }
    window.location.href = "/";
    return null;
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpenModal, setOpenModal] = useState(
    user === null || user === undefined ? true : !user.logado ?? true
  );

  return (
    <Router>
      <CssBaseline />
      <NavBar isOpenModal={isOpenModal} setOpenModal={setOpenModal} />
      <LoginModal open={isOpenModal} onClose={() => setOpenModal(false)} />
      <Box component="main" sx={{ p: 3, mt: 8 }}>
        <Routes>
          <Route
            path="/"
            element={<Home isOpenModal={isOpenModal} setOpenModal={setOpenModal} />}
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register-pet" element={<RegisterPet />} />
          <Route path="/search-pets" element={<SearchPets />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/cadastro-usuario" element={<Cadastro />} />
          <Route path="/logout" element={<LogOut />} />
          {/* ADICIONE ESTA ROTA - Mensagens */}
          <Route path="/mensagens" element={<Mensagens />} />
          <Route
            path="*"
            element={
              <Container>
                <Typography variant="h2">404 - Página não encontrada</Typography>
              </Container>
            }
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;