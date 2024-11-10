const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk serving static files
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route untuk panduan wudhu
app.get('/wudhu', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'wudhu-guide.html'));
});

// Route untuk panduan shalat
app.get('/shalat', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'shalat-guide.html'));
});

// Route untuk halaman about
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Error handling untuk route yang tidak ditemukan
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Error handling untuk kesalahan server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan pada server!');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});

// Middleware untuk logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Middleware untuk security headers
app.use((req, res, next) => {
    // Menambahkan security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Middleware untuk CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});