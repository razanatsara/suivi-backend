const User = require('../Model/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// signup user
module.exports.signupUser = async (req, res) => {
  const {
    nom,
    prenom,
    email,
    password,
    passwordVerify,
    isAdmin,
    isDirection,
    isScolarite,
  } = req.body;

  // validation
  if (!email || !password || !passwordVerify)
    return res
      .status(400)
      .json({ errorMessage: 'Veuillez remplir tous les champs.' });

  if (password.length < 6)
    return res.status(400).json({
      errorMessage: 'Le mot de passe doit avoir plus de 6 caractères.',
    });

  if (password !== passwordVerify)
    return res.status(400).json({
      errorMessage: 'Les deux mots de passes ne sont plus identiques.',
    });
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({
      errorMessage: 'Cette mail possède déjà un compte.',
    });

  try {
    const user = await User.signup(
      nom,
      prenom,
      email,
      password,
      isAdmin,
      isDirection,
      isScolarite
    );

    res.status(201).send(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login direction
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // create a token
    const token = createToken(user._id);
    if (user.isAdmin === true) {
      res
        .cookie('admin', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .send();
    }
    if (user.isDirection === true) {
      res
        .cookie('direction', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .send();
    }
    if (user.isScolarite === true) {
      res
        .cookie('scolarite', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .send();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports.logoutAdmin = (req, res) => {
  res
    .cookie('admin', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    })
    .send();
};
module.exports.logoutDirection = (req, res) => {
  res
    .cookie('direction', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    })
    .send();
};
module.exports.logoutScolarite = (req, res) => {
  res
    .cookie('scolarite', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    })
    .send();
};

module.exports.loggedInAdmin = (req, res) => {
  try {
    const token = req.cookies.admin;
    if (!token) return res.json(false);
    jwt.verify(token, process.env.SECRET);
    res.send(true);
  } catch (err) {
    res.json(false);
  }
};
module.exports.loggedInDirection = (req, res) => {
  try {
    const token = req.cookies.direction;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
};
module.exports.loggedInScolarite = (req, res) => {
  try {
    const token = req.cookies.scolarite;
    if (!token) return res.json(false);
    jwt.verify(token, process.env.SECRET);
    res.send(true);
  } catch (err) {
    res.json(false);
  }
};
