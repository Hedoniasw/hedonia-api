const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://felipetempos:Felbeowulf87@cluster0.m5lqk.mongodb.net/hedonia?retryWrites=true&w=majority&appName=Cluster0');

    console.log('🟢 Conectado ao MongoDB Atlas');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
