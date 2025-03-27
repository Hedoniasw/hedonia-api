const jwt = require('jsonwebtoken');
const JWT_SECRET = 'chave-secreta-top-da-hedonia'; // mesma usada no login

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado' });
  }

  const token = authHeader.split(' ')[1]; // formato: "Bearer token"

  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // injeta os dados do usuário no request
    next(); // libera o acesso à rota
  } catch (err) {
    return res.status(403).json({ error: 'Token expirado ou inválido' });
  }
};

module.exports = verifyToken;
