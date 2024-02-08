const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./Controllers/register');
const signin = require('./Controllers/signin');
const profile = require('./Controllers/profile');
const image = require('./Controllers/image');


const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '881102',
    database: 'smart-brain'
  }
});

const app = express();

app.use(cors());
app.use(express.json());

//signin --> post = success/fail
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

//register --> post = user new
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});


app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

//image --> PUT --> user
app.put('/image', (req, res) => {image.handlerImagePut(req, res, db)});
app.post('/imageUrl', (req, res) => {image.handleApiCall(req, res)});
  

app.listen(3000, () => {
  console.log('app running on port 3000');
})
