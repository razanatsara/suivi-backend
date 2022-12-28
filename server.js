require('dotenv').config({ path: './config/.env' });
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const userRoute = require('./Route/userRoute');
const etudiantRoute = require('./Route/etudiantRoute');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user', userRoute);
app.use('/api/etudiant', etudiantRoute);

mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.BDD_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT, (req, res) => {
      console.log('Le serveur demarre sur le port ', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
