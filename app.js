const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const Post = require('./models/post');

const app = express();

const MONGO_ATLAS_PW = 'URth3TD5RXcdGdl8'

mongoose.connect('mongodb+srv://mostafa:' + MONGO_ATLAS_PW + '@cluster0-k2php.mongodb.net/test')
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connect to database faild');
    });
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/', express.static(path.join(__dirname, 'angular')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-with, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'    
    );
    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});

module.exports = app;