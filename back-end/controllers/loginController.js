const { Router } = require('express');
const { generateToken } = require('../auth/token');

const loginRouter = Router();

const validateEmail = (mail) => {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  return re.test(String(mail));
};

const validatePassword = (pass) => {
  const re = /^([0-9]{6})$/;
  return re.test(pass);
};

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({ message: 'Campos inválidos' });
  }

  const token = await generateToken({ email, password });

  return res.status(200).json({ token });
});

module.exports = loginRouter;
