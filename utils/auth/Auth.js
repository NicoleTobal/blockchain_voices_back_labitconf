import { createUserInDB, findUserByIdInDB, findUserByUsernameInDB } from '../databaseConnection';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const secret = process.env.AUTH_SECRET;

export const register = (username, password, callback) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  createUserInDB(username, hashedPassword, function (err, user) {
    if (err) return callback(err);
    // create a token
    var token = jwt.sign({ id: user._id }, secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    callback(null, { auth: true, token: token });
  });
}

export const verifyAuthHeader = (token, res, next) => {
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      } else {
        const user = findUserByIdInDB(decoded ? decoded.id : '');
        if (!user) {
          return res.status(404).send("No user found.");
        } else {
          next();
        }
      }
    });
  }
}

export const login = (username, password, callback) => {
  findUserByUsernameInDB(username).then((user) => {
    if (!user) {
      return callback({errCode: 404, errMessage: 'No user found.'});
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return callback({errCode: 401, errMessage: { auth: false, token: null }});
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    callback({}, { auth: true, token: token })
  });
}