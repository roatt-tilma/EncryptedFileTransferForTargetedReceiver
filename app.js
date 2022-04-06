const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB connection established successfully');
});


app.listen(PORT, () => {
    console.log(`Server started listening at port ${PORT}`);
});


const userRouter = require('./routes/users');
const authenticationRouter = require('./routes/authentication');
const siteRouter = require('./routes/site');

app.use('/users', userRouter);
app.use('/authentication', authenticationRouter);
app.use('/site', siteRouter);

app.get('/', (req, res) => {
    res.render('index', { title: 'HOME' });
});

app.use((req, res) => {
    res.send('404 not found!');
});