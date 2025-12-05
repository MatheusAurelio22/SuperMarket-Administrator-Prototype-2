import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOADS_DIR || 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar produtos' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { name, price, type, description, expires_at, quantity } = req.body;

  const imagePath = req.file ? req.file.filename : null;

  try {
    const { rows } = await db.query(
      `INSERT INTO products 
        (name, price, type, description, expires_at, quantity, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        price,
        type || null,
        description || null,
        expires_at || null,
        quantity || 0,
        imagePath
      ]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
});

router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, price, type, description, expires_at, quantity } = req.body;

  const imagePath = req.file ? req.file.filename : null;

  try {
    const { rows } = await db.query(
      `UPDATE products
       SET name = $1,
           price = $2,
           type = $3,
           description = $4,
           expires_at = $5,
           quantity = $6,
           image = COALESCE($8, image)
       WHERE id = $7
       RETURNING *`,
      [
        name,
        price,
        type || null,
        description || null,
        expires_at || null,
        quantity || 0,
        id,         
        imagePath   
      ]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});


router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Produto removido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover produto' });
  }
});


router.post('/:id/promo', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { type, value, expires_at } = req.body;

  if (!['value', 'percent'].includes(type)) {
    return res.status(400).json({ message: 'Tipo de promoção inválido' });
  }

  if (Number(value) <= 0) {
    return res.status(400).json({ message: 'Valor da promoção inválido' });
  }

  try {
    const { rows: found } = await db.query(
      'SELECT price FROM products WHERE id = $1',
      [id]
    );

    if (!found[0]) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const price = Number(found[0].price);
    let promoPrice = price;

    if (type === 'value') {
      promoPrice = price - Number(value);
    }

    if (type === 'percent') {
      promoPrice = price - price * (Number(value) / 100);
    }

    if (promoPrice < 0) promoPrice = 0;

    const { rows } = await db.query(
      `UPDATE products
       SET promo_price = $1,
           promo_expires_at = $2
       WHERE id = $3
       RETURNING *`,
      [promoPrice, expires_at || null, id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao aplicar promoção' });
  }
});


router.delete('/:id/promo', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `UPDATE products
       SET promo_price = NULL,
           promo_expires_at = NULL
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao remover promoção' });
  }
});

export default router;
