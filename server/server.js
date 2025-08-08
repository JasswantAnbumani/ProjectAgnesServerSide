const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/accepted', (req, res) => {
  const { message } = req.body;

  const logData = {
    message,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'accepted.json');
  fs.writeFile(filePath, JSON.stringify(logData, null, 2), (err) => {
    if (err) {
      console.error('❌ Gagal menyimpan jawaban:', err);
      return res.status(500).json({ success: false, error: 'Failed to save' });
    }

    console.log(`💌 Accepted Response Saved: ${message}`);
    res.status(200).json({ success: true, message: 'Accepted logged successfully' });
  });
});

app.get('/api/accepted', (req, res) => {
  const filePath = path.join(__dirname, 'accepted.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ accepted: false, message: 'Belum ada jawaban' });
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(data);

  return res.json({ accepted: true, data: parsed });
});

app.post('/api/log/:event', (req, res) => {
  const { message } = req.body;
  const event = req.params.event;
  console.log(`📥 Event: ${event} - Message: ${message}`);
  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
