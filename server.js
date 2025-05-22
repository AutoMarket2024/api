import express from "express";
import pkg from '@prisma/client'; // importação segura e compatível
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// POST - Criar usuário
app.post("/usuario", async (req, res) => {
  const novoUsuario = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(201).json(novoUsuario);
});

// GET - Listar usuários com filtro opcional
app.get("/usuario", async (req, res) => {
  const { name, email, age } = req.query;

  const users = await prisma.user.findMany({
    where: {
      ...(name && { name }),
      ...(email && { email }),
      ...(age && { age: Number(age) }),
    },
  });

  res.status(200).json(users);
});

// PUT - Atualizar usuário
app.put("/usuario/:id", async (req, res) => {
  const updated = await prisma.user.update({
    where: {
      id: String(req.params.id),
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });

  res.status(200).json(updated);
});

// DELETE - Remover usuário
app.delete("/usuario/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: String(req.params.id),
    },
  });

  res.status(200).json({ message: "Usuário removido com sucesso" });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
