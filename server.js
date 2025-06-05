import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());
// metodo post par criar usuario
app.post("/usuario", async (req, res) => {
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(201).json(req);
});
//metodo get pra listar usuario-

app.get("/usuario", async (req, res) => {
  let user = [];
  if (req.query) {
    user = await prisma.user.findMany({
      where: {
        name: req.query.name,
        email: req.query.email,
        age: req.query.age,
      },
    });
    res.status(200).json(user);
  } else {
    user = await prisma.user.findMany();
  }
  //const users = await prisma.user.findMany();
  res.status(200).json(users);
});

//metodo put para editar usuario
app.put("/usuario/:id", async (req, res) => {
  //console.log(req);
  await prisma.user.update({
    where: {
      id: req.params.id,
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
    },
  });
  res.status(201).json(req.body);
});

app.delete("/usuario/:id", async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).json({ message: "User deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
