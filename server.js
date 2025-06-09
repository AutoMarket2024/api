import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;
const JWT_SECRET = "segredo";

// frontend/src/api.js
const API_URL = import.meta.env.VITE_API_URL;

export async function buscarDados() {
  const response = await fetch(`${API_URL}/rota`);
  const data = await response.json();
  return data;
}

app.use(
  cors({
    origin: "https//gestaocarro1.netlify.app/", // seu domínio Netlify
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Conexão com MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:123@user.lqedjx0.mongodb.net/User?retryWrites=true&w=majority&appName=User",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

// ✅ Modelo de usuário
const UsuarioSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);

// ✅ Rota de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    return res
      .status(401)
      .json({ success: false, message: "Usuário não encontrado" });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ success: false, message: "Senha inválida" });
  }

  const token = jwt.sign(
    { id: usuario._id, email: usuario.email },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ success: true, token });
});

// Create user
app.post("/usuario", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        repeatePassword: req.body.repeatePassword,
        telephone: req.body.telephone,
        address: req.body.address,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create car
app.post("/carro", async (req, res) => {
  try {
    const cars = await prisma.carro.create({
      data: {
        matricula: req.body.matricula,
        marca: req.body.marca,
        modelo: req.body.modelo,
        cor: req.body.cor,
        cilindrada: parseInt(req.body.cilindrada),
      },
    });
    res.status(201).json(cars);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get users
app.get("/usuario", async (req, res) => {
  try {
    let users = [];

    if (Object.keys(req.query).length > 0) {
      const whereClause = {};

      if (req.query.email) whereClause.email = req.query.email;
      if (req.query.name) whereClause.name = req.query.name;
      if (req.query.telephone) whereClause.telephone = req.query.telephone;
      if (req.query.address) whereClause.address = req.query.address;

      users = await prisma.user.findMany({
        where: whereClause,
      });
    } else {
      users = await prisma.user.findMany();
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cars
app.get("/carro", async (req, res) => {
  try {
    let cars = [];

    if (Object.keys(req.query).length > 0) {
      const whereClause = {};

      if (req.query.matricula) whereClause.matricula = req.query.matricula;
      if (req.query.marca) whereClause.marca = req.query.marca;
      if (req.query.modelo) whereClause.modelo = req.query.modelo;
      if (req.query.cor) whereClause.cor = req.query.cor;
      if (req.query.cilindrada)
        whereClause.cilindrada = parseInt(req.query.cilindrada);

      cars = await prisma.carro.findMany({
        where: whereClause,
      });
    } else {
      cars = await prisma.carro.findMany();
    }

    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put("/usuario/:id", async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        repeatePassword: req.body.repeatePassword, // Fixed typo
        telephone: req.body.telephone,
        address: req.body.address,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update car
app.put("/carro/:id", async (req, res) => {
  try {
    const updatedCar = await prisma.carro.update({
      where: {
        id: req.params.id,
      },
      data: {
        matricula: req.body.matricula,
        marca: req.body.marca,
        modelo: req.body.modelo,
        cor: req.body.cor,
        cilindrada: parseInt(req.body.cilindrada),
      },
    });
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user
app.delete("/usuario/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete car
app.delete("/carro/:id", async (req, res) => {
  try {
    await prisma.carro.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Car deleted successfully" }); // Fixed message
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
