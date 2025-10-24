import fs from 'fs'
import path from 'path'

const catalogFile = path.join(process.cwd(), 'backend', 'src', 'data', 'devCatalog.json')

function readCatalog() {
  try {
    if (!fs.existsSync(catalogFile)) {
      fs.mkdirSync(path.dirname(catalogFile), { recursive: true })
      fs.writeFileSync(catalogFile, JSON.stringify([]), 'utf-8')
    }
    const raw = fs.readFileSync(catalogFile, 'utf-8')
    const data = JSON.parse(raw || '[]')
    return Array.isArray(data) ? data : []
  } catch (e) {
    return []
  }
}

function writeCatalog(products) {
  try {
    fs.mkdirSync(path.dirname(catalogFile), { recursive: true })
    fs.writeFileSync(catalogFile, JSON.stringify(products, null, 2), 'utf-8')
    return true
  } catch (e) {
    return false
  }
}

export const getDevCatalog = (req, res) => {
  const products = readCatalog()
  res.status(200).json({ success: true, count: products.length, products })
}

export const putDevCatalog = (req, res) => {
  const products = Array.isArray(req.body?.products) ? req.body.products : []
  const ok = writeCatalog(products)
  if (!ok) {
    return res.status(500).json({ success: false, error: 'Failed to write catalog' })
  }
  res.status(200).json({ success: true, count: products.length })
}