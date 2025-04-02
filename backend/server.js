require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
const port = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(express.json());

// 🔗 Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database');
});


// ======================
// 👤 AUTH ROUTES
// ======================

app.post('/api/users/signup', (req, res) => {
  const { name, email, password, profileImage } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const insertQuery = 'INSERT INTO users (name, email, password, profileImage) VALUES (?, ?, ?, ?)';
    db.query(insertQuery, [name, email, password, profileImage || null], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const query = 'SELECT id, name, email, profileImage FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(results[0]);
  });
});


// ======================
// 🐾 PET ROUTES
// ======================

app.get('/api/pets', (req, res) => {
  db.query('SELECT * FROM pets', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM pets WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Pet not found' });
    res.json(results[0]);
  });
});

app.post('/api/pets', (req, res) => {
  const { name, breed, age, type, description, location, image, ownerId } = req.body;

  if (!name || !breed || !age || !type || !description || !location) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  const query = `
    INSERT INTO pets (name, breed, age, type, description, location, image, ownerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [name, breed, age, type, description, location, image || '', ownerId || null];

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId });
  });
});

app.put('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const { name, breed, age, type, description, location, image } = req.body;

  const query = `
    UPDATE pets 
    SET name = ?, breed = ?, age = ?, type = ?, description = ?, location = ?, image = ?
    WHERE id = ?
  `;

  const values = [name, breed, age, type, description, location, image, id];

  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pet updated successfully' });
  });
});


// ======================
// 🔔 NOTIFICATION ROUTES
// ======================

app.post('/api/notifications', (req, res) => {
  let { type, message, petId, fromUserId, toUserId } = req.body;
  const id = randomUUID();

  if (!message || !toUserId) {
    return res.status(400).json({ error: 'Missing required fields for notification' });
  }

  if (!type) type = 'adoption';

  const query = `
    INSERT INTO notifications (id, type, message, petId, fromUserId, userId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [id, type, message, petId || null, fromUserId || null, toUserId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Notification sent' });
  });
});

app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  db.query(
    'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.put('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  db.query('UPDATE notifications SET isRead = 1 WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Marked as read' });
  });
});

app.put('/api/notifications/mark-all/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('UPDATE notifications SET isRead = 1 WHERE userId = ?', [userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'All notifications marked as read' });
  });
});


// ======================
// 💬 CHAT ROUTES
// ======================

app.post('/api/messages', (req, res) => {
  const { senderId, receiverId, content } = req.body;
  const id = randomUUID();

  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.query(
    'INSERT INTO messages (id, senderId, receiverId, content) VALUES (?, ?, ?, ?)',
    [id, senderId, receiverId, content],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Message sent' });
    }
  );
});

app.get('/api/messages/:user1Id/:user2Id', (req, res) => {
  const { user1Id, user2Id } = req.params;

  const query = `
    SELECT * FROM messages
    WHERE (senderId = ? AND receiverId = ?)
       OR (senderId = ? AND receiverId = ?)
    ORDER BY createdAt ASC
  `;

  db.query(query, [user1Id, user2Id, user2Id, user1Id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/messages/threads/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT DISTINCT u.id AS userId, u.name, u.profileImage
    FROM messages m
    JOIN users u ON u.id = IF(m.senderId = ?, m.receiverId, m.senderId)
    WHERE m.senderId = ? OR m.receiverId = ?
  `;

  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// ======================
// 🚀 START SERVER
// ======================

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
