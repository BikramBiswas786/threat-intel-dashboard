require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
});

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('threat_intel.db', (err) => {
  if (err) console.error('DB Error:', err);
  else console.log('✅ SQLite connected: threat_intel.db');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS threat_reports (
      id TEXT PRIMARY KEY,
      country_code TEXT,
      tool_name TEXT,
      status TEXT,
      speed_mbps REAL,
      success_rate REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database schema initialized');
});

// health
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// stats
app.get('/api/stats', (req, res) => {
  db.all(
    `SELECT 
      COUNT(DISTINCT country_code) as countries_tracked,
      COUNT(DISTINCT tool_name) as tools_tracked,
      COUNT(*) as total_reports
     FROM threat_reports`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const row = rows?.[0] || {};
      res.json({
        total_reports: row.total_reports || 0,
        countries_tracked: row.countries_tracked || 0,
        tools_tracked: row.tools_tracked || 0,
        timestamp: new Date().toISOString(),
      });
    }
  );
});

// threats
app.get('/api/threats', (req, res) => {
  const country = (req.query.country || 'IR').toUpperCase();

  db.all(
    `SELECT 
      tool_name as tool,
      COUNT(*) as reports,
      ROUND(AVG(speed_mbps), 1) as speed,
      ROUND(100.0 * SUM(CASE WHEN status='working' THEN 1 ELSE 0 END) / COUNT(*), 1) as effectiveness
     FROM threat_reports
     WHERE country_code = ?
     GROUP BY tool_name
     ORDER BY effectiveness DESC`,
    [country],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        country,
        count: rows ? rows.length : 0,
        threats: rows || [],
        generated_at: new Date().toISOString(),
      });
    }
  );
});

// report
app.post('/api/report', (req, res) => {
  const { country, tool, status, speed_mbps, success_rate } = req.body;

  if (!country || !tool || !status) {
    return res.status(400).json({ error: 'country, tool, status are required' });
  }

  if (!['working', 'slow', 'blocked'].includes(status)) {
    return res.status(400).json({ error: 'status must be working | slow | blocked' });
  }

  const id = uuidv4();

  db.run(
    `INSERT INTO threat_reports
       (id, country_code, tool_name, status, speed_mbps, success_rate, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
    [id, country.toUpperCase(), tool.toLowerCase(), status, speed_mbps || null, success_rate || null],
    (err) => {
      if (err) {
        console.error('Error inserting report:', err);
        return res.status(500).json({ error: 'Failed to submit report', details: err.message });
      }

      io.emit('new_report', {
        id,
        country: country.toUpperCase(),
        tool,
        status,
        speed_mbps,
        success_rate,
      });

      console.log(`✅ Report submitted: ${country}/${tool}/${status}`);
      res.json({ success: true, id, message: 'Report submitted successfully' });
    }
  );
});

io.on('connection', (socket) => {
  console.log(`🔌 Connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
});
