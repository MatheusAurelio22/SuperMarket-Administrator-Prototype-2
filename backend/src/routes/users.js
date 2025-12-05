import express from 'express';
import db from '../db.js';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const __dirname = path.resolve();
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR))
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, cpf, photo FROM users ORDER BY id'
    );
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, cpf, photo FROM users WHERE id = $1',
      [req.params.id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, email, cpf, password } = req.body;

  if (!name || !email || !cpf || !password)
    return res.status(400).json({ message: 'Campos obrigatórios não enviados' });

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, email, cpf, password) VALUES ($1,$2,$3,$4) RETURNING id,name,email,cpf,photo',
      [name, email, cpf, hashed]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);

    if (err.code === '23505')
      return res.status(400).json({ message: 'Email já cadastrado' });

    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { name, email, cpf, password } = req.body;
  const id = req.params.id;

  try {
    const data = [name, email, cpf];
    let query = 'UPDATE users SET name=$1, email=$2, cpf=$3';

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query += ', password=$4 WHERE id=$5 RETURNING id,name,email,cpf,photo';
      data.push(hashed, id);
    } else {
      query += ' WHERE id=$4 RETURNING id,name,email,cpf,photo';
      data.push(id);
    }

    const result = await db.query(query, data);
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ message: 'Usuário removido' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover usuário' });
  }
});

router.post('/:id/photo', authenticateToken, upload.single('photo'), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: 'Nenhuma foto enviada' });

  try {
    await db.query(
      'UPDATE users SET photo=$1 WHERE id=$2',
      [req.file.filename, req.params.id]
    );

    res.json({
      message: 'Foto enviada',
      photo: `/uploads/${req.file.filename}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao salvar foto' });
  }
});

export default router;
