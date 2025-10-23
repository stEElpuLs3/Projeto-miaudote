const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Importa apenas as rotas do usuário
const usuariosRouter = require('./api/usuarios');
app.use('/api/usuarios', usuariosRouter);
// Importa as rotas dos pets
const petsRouter = require('./api/pets');
app.use('/api/pets', petsRouter);
// Importa as rotas das mensagens
const mensagensRouter = require('./api/mensagens');
app.use('/api/mensagens', mensagensRouter);
// Importa as rotas de email
const emailRouter = require('./api/email');
app.use('/api/email', emailRouter);
// Importa as rotas de favoritos
const favoritosRouter = require('./api/favoritos');
app.use('/api/favoritos', favoritosRouter);

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar:', err));

app.listen(3001, () => console.log('🚀 Servidor rodando na porta 3001'));