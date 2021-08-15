require('dotenv').config();

const SECRET = process.env.SECRET || 'token_secret';
const CONFIG = {
  expiresIn: '7d',
  algorithm: 'HS256'
};

const jwt = require('jsonwebtoken');

const generateToken = async (user) => {
  const { password: _, ...userWithoutPassword } = user.dataValues;

  return jwt.sign({ userWithoutPassword }, SECRET, CONFIG);
};

const decodeToken = (token) => jwt.verify(token, SECRET);

module.exports = { generateToken, decodeToken };
