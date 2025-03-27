const express = require('express');

const connectDB = require('./config/db');

const User = require('./models/User');

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'chave-secreta-top-da-hedonia';

const bcrypt = require('bcrypt');

const app = express();

// Middleware para interpretar JSON
app.use(express.json());

// Rota de login (POST /auth/login)
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(401).json({ error: 'Senha incorreta' });
}


    // Gerar token JWT
const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    name: user.name
  },
  JWT_SECRET,
  { expiresIn: '2h' }
);

// Retornar token junto com dados
return res.status(200).json({
  message: 'Login bem-sucedido',
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});


// Rota de cadastro (POST /auth/register)
app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Verifica se o email já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: 'Email já registrado' });
    }

   // Criptografar a senha antes de salvar
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Cria e salva o novo usuário com a senha criptografada
const newUser = new User({ name, email, password: hashedPassword });
await newUser.save();


    return res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
});

const verifyToken = require('./middleware/auth');

// Rota protegida (exemplo)
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `Bem-vindo(a) ao painel, ${req.user.name}!`,
    user: req.user
  });
});

// Rota principal de teste
app.get('/', (req, res) => {
  res.send('Hedonia API Online');
});

// Exporta o app para os testes (Vitest vai usar isso)
module.exports = app;

// Conectar ao banco e iniciar o servidor
connectDB();
// Se estiver rodando diretamente (node server.js), liga o servidor
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}
