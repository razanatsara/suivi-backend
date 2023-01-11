const jwt = require('jsonwebtoken');

function directionMiddleware(req, res, next) {
  try {
    const token = req.cookies.direction;
    if (!token)
      return res.status(401).json({ errorMessage: "Vous n'êtes pas autorisé" });
    const verified = jwt.verify(token, process.env.SECRET);

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Vous n'êtes pas autorisé" });
  }
}

module.exports = directionMiddleware;
