require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS FIX (safe for deployment)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// =====================
// PostgreSQL Connection
// =====================
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE || 'sih_db',
      password: process.env.PG_PASSWORD || 'postgres',
      port: process.env.PG_PORT || 5432,
    };

const pool = new Pool(poolConfig);

// DB connection check
pool.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL successfully!');
  }
});

// =====================
// HEALTH CHECK ROUTE
// =====================
app.get("/", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

// =====================
// REGISTER API
// =====================
app.post('/api/register', async (req, res) => {
  const { username, password, role, location, phone } = req.body;

  try {
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const insertQuery = `
      INSERT INTO users (username, password_hash, role, location, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, role, location, phone
    `;

    const result = await pool.query(insertQuery, [
      username,
      passwordHash,
      role,
      location,
      phone
    ]);

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error('❌ Registration Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================
// LOGIN API
// =====================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(500).json({ error: "Password missing in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    delete user.password_hash;

    res.status(200).json({
      message: 'Login successful',
      user
    });

  } catch (err) {
    console.error('❌ Login Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================
// GET PROFILE
// =====================
app.get('/api/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, username, role, location, phone, bio, sport, experience_level, created_at 
       FROM users 
       WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('❌ Get Profile Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================
// UPDATE PROFILE
// =====================
app.put('/api/profile/:username', async (req, res) => {
  const { username } = req.params;
  const { location, phone, bio, sport, experience_level } = req.body;

  try {
    const updateQuery = `
      UPDATE users
      SET location = $1,
          phone = $2,
          bio = $3,
          sport = $4,
          experience_level = $5
      WHERE username = $6
      RETURNING id, username, role, location, phone, bio, sport, experience_level
    `;

    const result = await pool.query(updateQuery, [
      location,
      phone,
      bio,
      sport,
      experience_level,
      username
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error('❌ Update Profile Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================
// START SERVER
// =====================
app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});