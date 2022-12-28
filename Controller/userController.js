const User = require('../Model/userModel')
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
  };

// login direction
module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.login(email, password);
      // create a token
      const token = createToken(user._id);
      if(user.isAdmin === true){
        utilisateur = 'Admin'
        res.status(200).send({ email, utilisateur, token });
      } 
      if(user.isDirection === true){
        utilisateur = 'Direction'
        res.status(200).send({ email, utilisateur, token });
      }
      if(user.isScolarite === true){
        utilisateur = 'Scolarite'
        res.status(200).send({ email, utilisateur, token });
      }
     
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// signup user
module.exports.signupUser = async (req, res) => {
    const { nom, prenom, email, password,isAdmin,isDirection,isScolarite } = req.body;
  
    try {
      const user = await User.signup(
        nom,
        prenom,
        email,
        password,
        isAdmin,
        isDirection,isScolarite
      );
  
      res.status(201).send(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };