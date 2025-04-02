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
// 👤 USER AUTH ROUTES
// ======================

// 👤 POST /api/users/signup
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
    db.query(insertQuery, [name, email, password, profileImage || null], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// 👤 POST /api/users/login
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
  const id = req.params.id;
  db.query('SELECT * FROM pets WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Pet not found' });
    res.json(results[0]);
  });
});

app.post('/api/pets', (req, res) => {
  const { name, breed, age, type, description, location, image, ownerId } = req.body;
  console.log('📥 New pet data received:', req.body);

  if (!name || !breed || !age || !type || !description || !location) {
    console.log('❌ Missing required fields');
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  const query = `
    INSERT INTO pets (name, breed, age, type, description, location, image, ownerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [name, breed, age, type, description, location, image || '', ownerId || null];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error inserting pet:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('✅ Pet added with ID:', result.insertId);
    res.status(201).json({ id: result.insertId, name, breed, age, type, description, location, image });
  });
});

app.put('/api/pets/:id', (req, res) => {
  const id = req.params.id;
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
  const { type, message, petId, fromUserId, toUserId } = req.body;
  const id = randomUUID();

  console.log('📨 Creating notification:', req.body);

  if (!type || !message || !toUserId) {
    return res.status(400).json({ error: 'Missing required fields for notification' });
  }

  const query = `
    INSERT INTO notifications (id, type, message, petId, fromUserId, userId)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [id, type, message, petId || null, fromUserId || null, toUserId];

  db.query(query, values, (err) => {
    if (err) {
      console.error('❌ Notification creation failed:', err.message);
      console.error('🔍 Query:', query);
      console.error('📦 Values:', values);
      return res.status(500).json({ error: err.message });
    }
    console.log('🔔 Notification created with ID:', id);
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
// 🚀 Start Server
// ======================

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
