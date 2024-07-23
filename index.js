const express = require('express')
const { Pool } = require('pg')
const app = express()
const port = 3000

const db = new Pool({
  user: 'corentin',
  password: 'coco11037',
  database: 'ica',
  port: 5433,
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/hook', (req, res) => {
  res.send('içi, les id et hook seront stocké')
})

app.get('/rules', (req, res) => {
  res.send('içi, les id et rules seront stocké')
})

app.get('/adapter', (req, res) => {
  res.send('içi, les id et adapter seront stocké')
})

app.get('/events', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events')
    res.json(result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur')
  }
})

app.get('/document-type', (req, res) => {
  res.send('içi, les id et les types de document seront stocké')
})

app.get('/erp', (req, res) => {
  res.send('içi, les id et les erp seront stocké')
})

app.get('/client', (req, res) => {
  res.send('içi, les id et les clients seront stocké')
})


app.listen(port, () => {
  console.log(`ICA API listening on port ${port}`)
})