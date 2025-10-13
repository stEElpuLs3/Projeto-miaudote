import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nome: String,
  telefone: String,
  email: String,
  senha: String,
  historico: Array
});

let User;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', UserSchema);
}

const uri = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const novoUser = new User(req.body);
    await novoUser.save();
    res.status(200).json({ mensagem: 'Usuário criado!' });
  } else if (req.method === 'GET') {
    const users = await User.find();
    res.status(200).json(users);
  } else {
    res.status(405).json({ mensagem: 'Método não permitido' });
  }
}
