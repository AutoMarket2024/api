import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// metodo post para criar usuario
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


// metodo post para criar carro
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

// metodo get para listar usuario
app.get("/usuario", async (req, res) => {
  try {
    let users = [];
    
    // Check if there are query parameters for filtering
    if (Object.keys(req.query).length > 0) {
      const whereClause = {};
      
      // Build where clause based on query parameters
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

// metodo get para listar carro
app.get("/carro", async (req, res) => {
  try {
    let cars = [];
    
    // Check if there are query parameters for filtering
    if (Object.keys(req.query).length > 0) {
      const whereClause = {};
      
      // Build where clause based on query parameters
      if (req.query.matricula) whereClause.matricula = req.query.matricula;
      if (req.query.marca) whereClause.marca = req.query.marca;
      if (req.query.modelo) whereClause.modelo = req.query.modelo;
      if (req.query.cor) whereClause.cor = req.query.cor;
      if (req.query.cilindrada) whereClause.cilindrada = req.query.cilindrada;
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

// metodo put para editar usuario
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
        repeatePassword: req.body.repeatepassword,
        telephone: req.body.telephone,
        address: req.body.address,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// metodo put para editar carro
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
        cilindrada: parseInt(req.body.cilindrada)
      },
    });
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// metodo delete para deletar usuario
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

// metodo delete para deletar carro
app.delete("/carro/:id", async (req, res) => {
  try {
    await prisma.carro.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});