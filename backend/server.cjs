const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const usuariosRouter = require('./api/usuarios.js');

const app = express();
app.use(express.json());
app.use(cors());

// Importa apenas as rotas do usuário, que já contém o modelo
app.use('/api/usuarios', usuariosRouter);

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar:', err));

app.listen(3001, () => console.log('🚀 Servidor rodando na porta 3001'));
