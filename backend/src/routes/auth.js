import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Chegou no login:", email, password);

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Usuário não encontrado' });

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: 'Senha incorreta' });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "CHAVE_PADRAO",
      { expiresIn: '8h' }
    );

    res.json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno' });
  }
});

router.get('/debug-user', async (req, res) => {
  const result = await db.query("SELECT email, password FROM users WHERE email = 'admin@teste.com'");
  res.json(result.rows[0]);
});

export default router;
