import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Setup lowdb
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { messages: [] }); // Set default data here

await db.read();
db.data ||= { messages: [] }; // Defensive default just in case
await db.write();

// Routes
app.get('/messages', async (req, res) => {
  await db.read();
  res.json(db.data.messages);
});

app.post('/messages', async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Missing name or message' });
  }

  db.data.messages.push({ name, message, time: new Date().toISOString() });
  await db.write();
  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
