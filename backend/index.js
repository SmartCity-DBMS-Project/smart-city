const express = require('express');
const { PrismaClient } = require('@prisma/client');
const buildingRouter = require('./routes/buildings');
const { json } = require('stream/consumers');

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8000

app.use(express.json());

app.use("/api/buildings", buildingRouter);

app.listen(PORT, () => console.log("Server running on port 8000"));
