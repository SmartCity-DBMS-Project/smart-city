import express from "express";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000

app.use(express.json());



app.listen(PORT, () => console.log("Server running on port 8000"));
