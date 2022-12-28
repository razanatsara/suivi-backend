const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nom: {
    type: String,
  },
  prenom: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean
  },
  isDirection:{
    type:Boolean
  },
  isScolarite:{
    type:Boolean
  },
});

// static signup method
userSchema.statics.signup = async function (
  nom,
  prenom,
  email,
  password,
  isAdmin,
  isDirection,
  isScolarite
) {
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("L'adresse mail existe déjà");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({
    nom,
    prenom,
    email,
    password: hash,
    isAdmin,
    isDirection,
    isScolarite
  });
  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("L'adresse mail n'existe pas");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Le mot de passe est incorecte');
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
