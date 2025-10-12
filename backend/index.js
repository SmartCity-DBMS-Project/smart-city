const express = require('express');
const buildingRouter = require('./routes/buildings');
const { json } = require('stream/consumers');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

const PORT = process.env.PORT || 8000

app.use(express.json());

app.use("/api/buildings/:type", buildingRouter);

app.listen(PORT, () => console.log("Server running on port 8000"));
