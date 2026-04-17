// src/server.ts
import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});