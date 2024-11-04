
// // server.js
// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:3000', // Ganti dengan URL frontend jika berbeda
//         methods: ['GET', 'POST'],
//     },
// });

// const port = 5001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Konfigurasi koneksi MySQL
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', // Sesuaikan dengan konfigurasi MySQL Anda
//     password: '',
//     database: 'begin_db', // Sesuaikan dengan nama database Anda
// });

// // Cek koneksi ke database
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL database');
// });

// // Endpoint untuk mendapatkan semua data pengguna
// app.get('/api/data', (req, res) => {
//     const query = 'SELECT * FROM user';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Server Error');
//             return;
//         }
//         res.json(results);
//     });
// });

// // Endpoint untuk mendapatkan detail pengguna berdasarkan id
// app.get('/api/user/:id', (req, res) => {
//     const userId = req.params.id;
//     const query = 'SELECT * FROM user WHERE id = ?';
//     db.query(query, [userId], (err, results) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Server Error');
//             return;
//         }
//         res.json(results[0]);  // Mengambil pengguna pertama dari hasil
//     });
// });

// // Menghubungkan dengan Socket.IO
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Mendengarkan event 'add_user' untuk menambah data pengguna baru
//     socket.on('add_user', (userData) => {
//         const query = 'INSERT INTO user (nama) VALUES (?)';
//         db.query(query, [userData.nama], (err, result) => {
//             if (err) {
//                 console.error('Error adding user:', err);
//                 return;
//             }

//             // Data pengguna baru yang ditambahkan
//             const newUser = { id: result.insertId, nama: userData.nama };
            
//             // Emit data pengguna baru ke semua klien
//             io.emit('new_user', newUser);
//         });
//     });

//     // Event saat user disconnect
//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// // Menjalankan server
// server.listen(port, () => {
//     console.log(`Server berjalan di http://localhost:${port}`);
// });


const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // URL frontend Anda
        methods: ['GET', 'POST'],
    },
});

const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Sesuaikan dengan username MySQL Anda
    password: '', // Sesuaikan dengan password MySQL Anda
    database: 'begin_db', // Sesuaikan dengan nama database Anda
});

// Cek koneksi ke database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint untuk mendapatkan semua data pengguna
app.get('/api/data', (req, res) => {
    const query = 'SELECT * FROM user';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results);
    });
});

// Endpoint untuk mendapatkan detail pengguna berdasarkan ID
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM user WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server Error');
            return;
        }
        res.json(results[0]); // Mengambil pengguna pertama dari hasil
    });
});

// Menghubungkan dengan Socket.IO
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Mendengarkan event 'add_user' untuk menambah data pengguna baru
    socket.on('add_user', (userData) => {
        const query = 'INSERT INTO user (nama) VALUES (?)';
        db.query(query, [userData.nama], (err, result) => {
            if (err) {
                console.error('Error adding user:', err);
                return;
            }

            // Data pengguna baru yang ditambahkan
            const newUser = { id: result.insertId, nama: userData.nama };

            // Emit data pengguna baru ke semua klien
            io.emit('new_user', newUser);
        });
    });

    // Event saat user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Polling untuk memperbarui data secara real-time
let currentUserCount = 0; // Menyimpan jumlah pengguna saat ini

setInterval(() => {
    db.query('SELECT COUNT(*) as count FROM user', (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        const newCount = results[0].count;
        if (newCount !== currentUserCount) {
            currentUserCount = newCount;
            // Emit event untuk memberi tahu bahwa data pengguna telah berubah
            io.emit('user_count_updated', newCount);
        }
    });
}, 5000); // Periksa setiap 5 detik

// Menjalankan server
server.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
