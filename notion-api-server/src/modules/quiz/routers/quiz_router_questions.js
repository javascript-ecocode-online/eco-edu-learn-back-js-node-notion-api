import express from 'express'
const router = express.Router()
import pool from '../db.js'

// Tạo câu hỏi mới
router.post('/', async (req, res) => {
  const { question_text, question_type } = req.body
  try {
    console.log('insert questions')
    const [result] = await pool.execute(
      'INSERT INTO questions (question_text, question_type) VALUES (?, ?)',
      [question_text, question_type]
    )
    res.json({
      id: result.insertId,
      question_text,
      question_type,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Lấy danh sách câu hỏi
router.get('/', async (req, res) => {
  try {
    console.log('select all questions')
    const [rows] = await pool.execute('SELECT * FROM questions')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Cập nhật câu hỏi
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { question_text, question_type } = req.body
  try {
    console.log('update question', id)
    await pool.execute(
      'UPDATE questions SET question_text = ?, question_type = ? WHERE id = ?',
      [question_text, question_type, id]
    )
    res.json({
      id,
      question_text,
      question_type,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Xóa câu hỏi
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    console.log('delete question', id)
    await pool.execute('DELETE FROM questions WHERE id = ?', [id])
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
