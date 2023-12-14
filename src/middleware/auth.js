const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); // remove 'Bearer ' from token string
    const decoded = jwt.verify(token, 'thisismynewcourse'); // decode token
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    }); // find user with correct id who has that authentication token still stored
    // console.log(user)
    if (!user) {
      throw new Error();
    }
    req.token = token; // store token on request object
    req.user = user; // store user on request object
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
