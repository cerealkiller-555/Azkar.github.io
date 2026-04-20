const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints

// 1. Authenticate / Register User
app.post('/api/auth/login', (req, res) => {
    const { email, mode } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (mode === 'signin') {
            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.json({ message: 'Login successful', user: row });
        }
        res.status(400).json({ error: 'Invalid mode or use register endpoint' });
    });
});

app.post('/api/auth/register', (req, res) => {
    const { name, email } = req.body;
    
    if (!email || !name) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User registered successfully', user: { id: this.lastID, name, email } });
        });
    });
});

// Update Profile
app.put('/api/auth/profile', (req, res) => {
    const { name, email } = req.body;
    db.run('UPDATE users SET name = ? WHERE email = ?', [name, email], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Profile updated successfully', user: { name, email } });
    });
});

// 2. Get Sync Data
app.get('/api/sync/:email/:date', (req, res) => {
    const { email, date } = req.params;
    
    db.all('SELECT type, data FROM progress WHERE user_email = ? AND date = ?', [email, date], (err, progressRows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const state = {};
        progressRows.forEach(row => {
            state[row.type] = JSON.parse(row.data);
        });
        
        // Also get user's streak (which might be the latest date independent row or another record)
        db.get('SELECT data FROM progress WHERE user_email = ? AND type = ?', [email, 'streak'], (err, streakRow) => {
            if (streakRow) state.streak = JSON.parse(streakRow.data);
            
            // Get custom duas
            db.all('SELECT id, dua_text FROM custom_duas WHERE user_email = ?', [email], (err, duaRows) => {
                if (duaRows) state.custom_duas = duaRows.map(d => ({id: d.id, text: d.dua_text}));
                res.json(state);
            });
        });
    });
});

// 3. Update Daily State (progress, completed, checklist)
app.post('/api/sync/state', (req, res) => {
    const { email, date, type, data } = req.body;
    
    db.get('SELECT id FROM progress WHERE user_email = ? AND date = ? AND type = ?', [email, date, type], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const dataStr = JSON.stringify(data);
        if (row) {
            db.run('UPDATE progress SET data = ? WHERE id = ?', [dataStr, row.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'State updated successfully' });
            });
        } else {
            db.run('INSERT INTO progress (user_email, date, type, data) VALUES (?, ?, ?, ?)', [email, date, type, dataStr], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'State created successfully' });
            });
        }
    });
});

// 4. Update Streak (no date specific)
app.post('/api/sync/streak', (req, res) => {
    const { email, streak } = req.body;
    
    db.get('SELECT id FROM progress WHERE user_email = ? AND type = ?', [email, 'streak'], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const dataStr = JSON.stringify(streak);
        if (row) {
            db.run('UPDATE progress SET data = ? WHERE id = ?', [dataStr, row.id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Streak updated successfully' });
            });
        } else {
            db.run('INSERT INTO progress (user_email, date, type, data) VALUES (?, ?, ?, ?)', [email, 'all', 'streak', dataStr], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Streak created successfully' });
            });
        }
    });
});

// 5. Custom Duas API
app.post('/api/duas', (req, res) => {
    const { email, dua_text } = req.body;
    db.run('INSERT INTO custom_duas (user_email, dua_text) VALUES (?, ?)', [email, dua_text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Dua added successfully', dua: { id: this.lastID, text: dua_text } });
    });
});

app.delete('/api/duas/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM custom_duas WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Dua deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
