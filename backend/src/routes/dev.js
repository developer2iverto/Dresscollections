import express from 'express'
import { getDevCatalog, putDevCatalog } from '../controllers/devCatalog.js'

const router = express.Router()

// Public read for storefronts on any port
router.get('/catalog', getDevCatalog)

// Write requires no auth in dev mode; guard lightly
router.put('/catalog', (req, res, next) => {
  // Optional simple token check
  const token = req.headers['x-dev-token'] || ''
  if (process.env.DEV_WRITE_TOKEN && token !== process.env.DEV_WRITE_TOKEN) {
    return res.status(403).json({ success: false, error: 'Forbidden' })
  }
  next()
}, putDevCatalog)

export default router